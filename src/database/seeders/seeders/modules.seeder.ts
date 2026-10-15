import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Module as SysModule } from 'src/modules/entities/module.entity';

@Injectable()
export class ModulesSeeder {
  constructor(
    @InjectRepository(SysModule)
    private readonly repo: Repository<SysModule>,
  ) {}

  async run() {
    const modules = [
      {
        name: 'Usuarios',
        description: 'Gestor de Usuarios',
        icon: 'heroicons_outline:user-group',
        path: 'usuarios',
      },
      {
        name: 'Adm. de Propiedades',
        description: 'Gestor de Propiedades',
        icon: 'heroicons_outline:home',
        path: 'properties',
      },
      {
        name: 'Reportes',
        description: 'Gestor de Reportes',
        icon: 'heroicons_outline:chart-bar',
        path: 'reportes',
      },
    ];

    await this.repo.save(modules);
  }
}
