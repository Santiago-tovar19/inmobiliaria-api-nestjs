import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PropertyStatus } from 'src/property-status/entities/property-status.entity/property-status.entity';

@Injectable()
export class PropertyStatusSeeder {
  constructor(
    @InjectRepository(PropertyStatus)
    private readonly repo: Repository<PropertyStatus>,
  ) {}

  async run() {
    const statuses = [
      { name: 'Disponible' },
      { name: 'En negociación' },
      { name: 'Vendido' },
    ];

    await this.repo.save(statuses);
  }
}
