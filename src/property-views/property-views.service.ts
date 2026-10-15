import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { PropertyView } from './entities/property-view.entity/property-view.entity';
import { Property } from 'src/properties/entities/property.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class PropertyViewsService {
  constructor(
    @InjectRepository(PropertyView)
    private readonly propertyViewRepo: Repository<PropertyView>,
  ) {}

  // Registrar una vista (si ya existe para el día, no duplica)
  async registerView(property: Property, user: User): Promise<PropertyView> {
    // Verificar si ya existe una vista hoy del mismo usuario
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const existing = await this.propertyViewRepo.findOne({
      where: {
        property: { id: property.id },
        user: { id: user.id },
        created_at: Between(today, tomorrow),
      },
    });

    if (existing) return existing;

    const view = this.propertyViewRepo.create({
      property,
      user,
    });

    return await this.propertyViewRepo.save(view);
  }

  // Contar vistas totales de una propiedad
  async countViews(propertyId: number): Promise<number> {
    return this.propertyViewRepo.count({
      where: { property: { id: propertyId } },
    });
  }

  // Listar vistas de una propiedad
  async listViews(
    propertyId: number,
    start?: Date,
    end?: Date,
  ): Promise<PropertyView[]> {
    const where: any = { property: { id: propertyId } };

    if (start && end) {
      where.created_at = Between(start, end);
    }

    return this.propertyViewRepo.find({
      where,
      relations: ['user'],
      order: { created_at: 'DESC' },
    });
  }

  async registerViewLegacy(
    userID: number,
    propertyID: number,
  ): Promise<PropertyView> {
    const view = this.propertyViewRepo.create({
      property: { id: propertyID } as Property,
      user: { id: userID } as User,
      day_of_week: new Date().getDay(),
    });

    return this.propertyViewRepo.save(view);
  }

  async getPropertyViewsLegacy(
    authUser: User,
    start?: string,
    end?: string,
  ): Promise<PropertyView[]> {
    const qb = this.propertyViewRepo
      .createQueryBuilder('propertyView')
      .leftJoinAndSelect('propertyView.property', 'property')
      .leftJoinAndSelect('propertyView.user', 'user');

    // Filtro por fechas (igual que Laravel)
    if (start && end) {
      qb.andWhere('propertyView.created_at BETWEEN :start AND :end', {
        start,
        end,
      });
    }

    // 🔴 ADMIN (role_id === 1) → todas las vistas
    if (authUser.role_id === 1) {
      return qb.getMany();
    }

    // 🟠 BROKER (role_id === 2) → vistas de sus propiedades
    if (authUser.role_id === 2) {
      qb.andWhere('property.broker_id = :brokerId', {
        brokerId: authUser.broker_id,
      });

      return qb.getMany();
    }

    // 🟡 AGENTE (role_id === 3) → vistas de propiedades creadas por él
    if (authUser.role_id === 3) {
      qb.andWhere('property.created_by = :agentId', {
        agentId: authUser.id,
      });

      return qb.getMany();
    }

    return [];
  }
}
