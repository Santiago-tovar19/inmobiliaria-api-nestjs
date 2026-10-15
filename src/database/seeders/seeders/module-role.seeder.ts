import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class RoleModulesSeeder {
  constructor(private readonly dataSource: DataSource) {}

  async run() {
    console.log('🌱 Seeding role_modules...');

    await this.dataSource.query(`
      INSERT INTO role_modules (role_id, module_id) VALUES
        (1, 1),
        (1, 2),
        (1, 3)
    `);
  }
}
