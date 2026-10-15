import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PropertyType } from './entities/property-type.entity/property-type.entity';

@Injectable()
export class PropertyTypeService {
  constructor(
    @InjectRepository(PropertyType)
    private readonly propertyTypeRepo: Repository<PropertyType>,
  ) {}

  async findAll(): Promise<PropertyType[]> {
    return this.propertyTypeRepo.find();
  }

  async findOne(id: number): Promise<PropertyType> {
    const type = await this.propertyTypeRepo.findOne({ where: { id } });
    if (!type) throw new NotFoundException('Tipo de propiedad no encontrado');
    return type;
  }

  async create(data: Partial<PropertyType>): Promise<PropertyType> {
    const type = this.propertyTypeRepo.create(data);
    return this.propertyTypeRepo.save(type);
  }

  async update(id: number, data: Partial<PropertyType>): Promise<PropertyType> {
    const type = await this.findOne(id);
    Object.assign(type, data);
    return this.propertyTypeRepo.save(type);
  }

  async remove(id: number): Promise<void> {
    const type = await this.findOne(id);
    await this.propertyTypeRepo.remove(type);
  }
}
