import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from 'src/roles/entities/role.entities';

@Injectable()
export class RolesSeeder {
  constructor(
    @InjectRepository(Role)
    private readonly repo: Repository<Role>,
  ) {}

  async run() {
    const roles = [
      this.repo.create({
        name: 'Master Admin',
        descripcion: 'Full system access',
      }),
      this.repo.create({
        name: 'Admin',
        descripcion: 'Property manager',
      }),
      this.repo.create({
        name: 'Agente',
        descripcion: 'Limited user',
      }),
      this.repo.create({
        name: 'Consumidor',
        descripcion: 'Consumer user',
      }),
    ];

    await this.repo.save(roles);
  }
}
