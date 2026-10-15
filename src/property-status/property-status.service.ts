import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PropertyStatus } from './entities/property-status.entity/property-status.entity';

@Injectable()
export class PropertyStatusService {
  constructor(
    @InjectRepository(PropertyStatus)
    private readonly propertyStatusRepo: Repository<PropertyStatus>,
  ) {}

  async findAll(): Promise<PropertyStatus[]> {
    return this.propertyStatusRepo.find();
  }

  async findOne(id: number): Promise<PropertyStatus> {
    const status = await this.propertyStatusRepo.findOne({ where: { id } });
    if (!status) throw new NotFoundException('Estado no encontrado');
    return status;
  }

  async create(data: Partial<PropertyStatus>): Promise<PropertyStatus> {
    const status = this.propertyStatusRepo.create(data);
    return this.propertyStatusRepo.save(status);
  }

  async update(
    id: number,
    data: Partial<PropertyStatus>,
  ): Promise<PropertyStatus> {
    const status = await this.findOne(id);
    Object.assign(status, data);
    return this.propertyStatusRepo.save(status);
  }

  async remove(id: number): Promise<void> {
    const status = await this.findOne(id);
    await this.propertyStatusRepo.remove(status);
  }
}
