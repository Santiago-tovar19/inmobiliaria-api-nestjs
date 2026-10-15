import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';

import { Property } from './entities/property.entity';
import { PropertyImage } from 'src/property-images/entities/property-image.entity/property-image.entity';
import { PropertyView } from 'src/property-views/entities/property-view.entity/property-view.entity';
import { User } from '../users/entities/user.entity';

import { PropertyViewsService } from 'src/property-views/property-views.service';
import { PropertyType } from 'src/property-types/entities/property-type.entity/property-type.entity';
import { PropertyStatus } from 'src/property-status/entities/property-status.entity/property-status.entity';
import { Currency } from 'src/currencies/entities/currency.entity/currency.entity';
import { ContractType } from 'src/contract-types/entities/contract-type.entity/contract-type.entity';

import { PropertyResource } from './resources/property.resource';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepo: Repository<Property>,

    @InjectRepository(PropertyType)
    private readonly propertyTypeRepo: Repository<PropertyType>,

    @InjectRepository(PropertyImage)
    private readonly propertyImageRepo: Repository<PropertyImage>,

    @InjectRepository(PropertyView)
    private readonly propertyViewRepo: Repository<PropertyView>,

    private readonly propertyViewsService: PropertyViewsService,
  ) {}

  // ----------------------------------------------------------------
  // LISTAR PROPIEDADES (Laravel-compatible)
  // ----------------------------------------------------------------
  async findAll(filters: any, user?: User, perPage = 10) {
    const page = filters.page ? Number(filters.page) : 1;
    const take = perPage;
    const skip = (page - 1) * take;

    const qb = this.propertyRepo
      .createQueryBuilder('property')
      .leftJoinAndSelect('property.propertyType', 'propertyType')
      .leftJoinAndSelect('property.status', 'status')
      .leftJoinAndSelect('property.currency', 'currency')
      .leftJoinAndSelect('property.contractType', 'contractType')
      .leftJoinAndSelect('property.images', 'images')
      .leftJoinAndSelect('property.createdBy', 'createdBy');

    // ----------------------------------------------------------
    // 🔍 BÚSQUEDA GLOBAL (q)
    // ----------------------------------------------------------
    if (filters.q && filters.q.trim() !== '') {
      const search = `%${filters.q.trim()}%`;
      qb.andWhere(
        new Brackets((q) => {
          q.where('property.name LIKE :search', { search })
            .orWhere('property.description LIKE :search', { search })
            .orWhere('property.address LIKE :search', { search })
            .orWhere('property.mls_number LIKE :search', { search });
        }),
      );
    }

    // ----------------------------------------------------------
    // 🎯 FILTROS DINÁMICOS (igual que Laravel)
    // ----------------------------------------------------------
    const searchableColumns = [
      'name',
      'description',
      'address',
      'mls_number',
      'construction_year',
      'location_type',
      'bedrooms',
      'bathrooms',
      'size',
      'price',
      'parking',
      'kitchen',
      'elevator',
      'wifi',
      'fireplace',
      'hoa',
      'stories',
      'featured',
      'published',
    ];

    for (const column of searchableColumns) {
      if (filters[column] !== undefined && filters[column] !== '') {
        qb.andWhere(`property.${column} LIKE :${column}`, {
          [column]: `%${filters[column]}%`,
        });
      }
    }

    // ----------------------------------------------------------
    // 💰 RANGO DE PRECIOS
    // ----------------------------------------------------------
    if (filters.minPrice && filters.maxPrice) {
      qb.andWhere('property.price BETWEEN :min AND :max', {
        min: filters.minPrice,
        max: filters.maxPrice,
      });
    }

    // ----------------------------------------------------------
    // 👥 FILTRO POR ROL (Laravel-style)
    // ----------------------------------------------------------
    if (user) {
      if (user.role?.id === 2 && user.broker) {
        qb.andWhere('property.broker_id = :brokerId', {
          brokerId: user.broker.id,
        });
      }

      if (user.role?.id === 3) {
        qb.andWhere('property.createdBy = :userId', {
          userId: user.id,
        });
      }
    }

    // ----------------------------------------------------------
    // ❤️ FAVORITOS
    // ----------------------------------------------------------
    if (filters.fav && user) {
      qb.innerJoin('property.favUsers', 'favUsers').andWhere(
        'favUsers.user_id = :userId',
        { userId: user.id },
      );
    }

    // ----------------------------------------------------------
    // 📊 ORDENAMIENTO
    // ----------------------------------------------------------
    if (filters.orderBy && filters.order) {
      qb.orderBy(
        `property.${filters.orderBy}`,
        filters.order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC',
      );
    } else {
      qb.orderBy('property.created_at', 'DESC');
    }

    // ----------------------------------------------------------
    // 📋 PAGINACIÓN (Laravel paginator)
    // ----------------------------------------------------------
    const [entities, total] = await qb.skip(skip).take(take).getManyAndCount();

    const lastPage = Math.ceil(total / take);
    const basePath =
      process.env.APP_URL?.replace(/\/$/, '') + '/api/properties' ||
      'http://localhost:8000/api/properties';

    const pageUrl = (p: number | null) =>
      p && p >= 1 && p <= lastPage ? `${basePath}?page=${p}` : null;

    return {
      current_page: page,
      data: PropertyResource.collection(entities),
      first_page_url: pageUrl(1),
      from: skip + 1,
      last_page: lastPage,
      last_page_url: pageUrl(lastPage),
      next_page_url: page < lastPage ? pageUrl(page + 1) : null,
      prev_page_url: page > 1 ? pageUrl(page - 1) : null,
      path: basePath,
      per_page: take,
      to: Math.min(skip + take, total),
      total,
    };
  }

  // ----------------------------------------------------------------
  // OBTENER UNA PROPIEDAD
  // ----------------------------------------------------------------
  async findOne(id: number, isAdmin = false) {
    const qb = this.propertyRepo
      .createQueryBuilder('property')
      .leftJoinAndSelect('property.propertyType', 'propertyType')
      .leftJoinAndSelect('property.status', 'status')
      .leftJoinAndSelect('property.currency', 'currency')
      .leftJoinAndSelect('property.contractType', 'contractType')
      .leftJoinAndSelect('property.images', 'images')
      .where('property.id = :id', { id });

    if (!isAdmin) {
      qb.andWhere('property.published = 1');
    }

    const property = await qb.getOne();

    if (!property) {
      throw new NotFoundException('Propiedad no encontrada');
    }

    return PropertyResource.make(property);
  }

  // ----------------------------------------------------------------
  // CREAR PROPIEDAD
  // ----------------------------------------------------------------
  async create(
    property: Property,
    images: any[],
    bannerImgs: any[],
    video?: any,
  ): Promise<Property> {
    const imgs: PropertyImage[] = [];

    for (const img of images) {
      imgs.push(
        this.propertyImageRepo.create({
          name: img.filename,
          type: 'Gallery',
        }),
      );
    }

    for (const banner of bannerImgs) {
      imgs.push(
        this.propertyImageRepo.create({
          name: banner.filename,
          type: 'Banner',
        }),
      );
    }

    property.images = imgs;
    if (video) property.video = video.filename;

    return this.propertyRepo.save(property);
  }

  // ----------------------------------------------------------------
  // ACTUALIZAR PROPIEDAD
  // ----------------------------------------------------------------
  async update(
    property: Property,
    updateData: any,
    images: any[],
    bannerImgs: any[],
    video?: any,
    filesToRemove?: number[],
  ): Promise<Property> {
    Object.assign(property, updateData);

    if (filesToRemove?.length) {
      await this.propertyImageRepo.delete(filesToRemove);
    }

    const imgs: PropertyImage[] = [];

    for (const img of images) {
      imgs.push(
        this.propertyImageRepo.create({
          name: img.filename,
          type: 'Gallery',
        }),
      );
    }

    for (const banner of bannerImgs) {
      imgs.push(
        this.propertyImageRepo.create({
          name: banner.filename,
          type: 'Banner',
        }),
      );
    }

    property.images.push(...imgs);
    if (video) property.video = video.filename;

    return this.propertyRepo.save(property);
  }

  // ----------------------------------------------------------------
  // ELIMINAR PROPIEDAD (SOFT DELETE)
  // ----------------------------------------------------------------
  async remove(id: number): Promise<void> {
    const property = await this.propertyRepo.findOne({ where: { id } });
    if (!property) throw new NotFoundException('Propiedad no encontrada');
    await this.propertyRepo.softRemove(property);
  }

  // ----------------------------------------------------------------
  // PROPIEDADES DESTACADAS
  // ----------------------------------------------------------------
  async getFeatureProperties(propertyID?: number): Promise<Property[]> {
    const qb = this.propertyRepo
      .createQueryBuilder('property')
      .leftJoinAndSelect('property.propertyType', 'propertyType')
      .leftJoinAndSelect('property.status', 'status')
      .leftJoinAndSelect('property.currency', 'currency')
      .leftJoinAndSelect('property.contractType', 'contractType')
      .leftJoinAndSelect('property.images', 'images');

    if (propertyID) {
      qb.where('property.id <> :id', { id: propertyID });
    }

    return qb.orderBy('RAND()').take(5).getMany();
  }

  // ----------------------------------------------------------------
  // FEATURES PARA FORMULARIOS
  // ----------------------------------------------------------------
  async getFeatures() {
    const [types, statuses, currencies, contracts] = await Promise.all([
      this.propertyRepo.manager.find(PropertyType),
      this.propertyRepo.manager.find(PropertyStatus),
      this.propertyRepo.manager.find(Currency),
      this.propertyRepo.manager.find(ContractType),
    ]);

    return { types, statuses, currencies, contracts };
  }

  async getPropertyTypes() {
    return this.propertyTypeRepo
      .createQueryBuilder('type')
      .loadRelationCountAndMap('type.properties_count', 'type.properties')
      .getMany();
  }
}
