import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PropertyType } from 'src/property-types/entities/property-type.entity/property-type.entity';

@Injectable()
export class PropertyTypesSeeder {
  constructor(
    @InjectRepository(PropertyType)
    private readonly repo: Repository<PropertyType>,
  ) {}

  async run() {
    await this.repo.save([
      { name: 'Casa' },
      { name: 'Apartamento' },
      { name: 'Penthouse' },
      { name: 'Nuevo Proyecto' },
      { name: 'Terreno' },
      { name: 'Corporativo' },
      { name: 'Propiedad' },
      { name: 'Vacacional' },
    ]);
  }
}
