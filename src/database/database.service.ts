import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { RolesSeeder } from './seeders/seeders/roles.seeder';
import { ModulesSeeder } from './seeders/seeders/modules.seeder';
import { PropertyStatusSeeder } from './seeders/seeders/property-status.seeder';
import { CurrenciesSeeder } from './seeders/seeders/currencies.seeder';
import { ContractTypeSeeder } from './seeders/seeders/contract-type.seeder';
import { AppointmentSeeder } from './seeders/seeders/appointment.seeder';
import { UsersSeeder } from './seeders/seeders/users.seeder';
import { PropertyViewsSeeder } from './seeders/seeders/property-views.seeder';
import { PropertyTypesSeeder } from './seeders/seeders/property-types.seeder';
import { PropertyImagesSeeder } from './seeders/seeders/property-images.seeder';
import { PropertiesSeeder } from './seeders/seeders/properties.seeder';
import { RoleModulesSeeder } from './seeders/seeders/module-role.seeder';
import { CountriesSeeder } from './seeders/seeders/countries.seeder';
import { BrokersSeeder } from './seeders/seeders/brokers.seeder';

@Injectable()
export class SeederService {
  constructor(
    private readonly dataSource: DataSource,

    private readonly rolesSeeder: RolesSeeder,
    private readonly modulesSeeder: ModulesSeeder,
    private readonly roleModulesSeeder: RoleModulesSeeder,

    private readonly currencySeeder: CurrenciesSeeder,
    private readonly contractTypeSeeder: ContractTypeSeeder,
    private readonly propertyStatusSeeder: PropertyStatusSeeder,

    private readonly countriesSeeder: CountriesSeeder,
    private readonly brokersSeeder: BrokersSeeder,
    private readonly usersSeeder: UsersSeeder,

    private readonly propertyTypes: PropertyTypesSeeder,
    private readonly propertiesSeeder: PropertiesSeeder,
    private readonly propertyViews: PropertyViewsSeeder,
    private readonly propertyImages: PropertyImagesSeeder,

    private readonly appointmentSeeder: AppointmentSeeder,
  ) {}

  private async clearTables() {
    console.log('🧹 Clearing tables...');

    await this.dataSource.query('SET FOREIGN_KEY_CHECKS = 0;');

    // HIJAS
    await this.dataSource.query('TRUNCATE TABLE role_modules;');
    await this.dataSource.query('TRUNCATE TABLE property_views;');
    await this.dataSource.query('TRUNCATE TABLE property_images;');
    await this.dataSource.query('TRUNCATE TABLE appointments;');

    // DEPENDIENTES
    await this.dataSource.query('TRUNCATE TABLE properties;');
    await this.dataSource.query('TRUNCATE TABLE property_types;');

    // PADRES
    await this.dataSource.query('TRUNCATE TABLE users;');
    await this.dataSource.query('TRUNCATE TABLE brokers;');
    await this.dataSource.query('TRUNCATE TABLE countries;');
    await this.dataSource.query('TRUNCATE TABLE roles;');
    await this.dataSource.query('TRUNCATE TABLE modules;');
    await this.dataSource.query('TRUNCATE TABLE currencies;');
    await this.dataSource.query('TRUNCATE TABLE contract_types;');
    await this.dataSource.query('TRUNCATE TABLE property_status;');

    await this.dataSource.query('SET FOREIGN_KEY_CHECKS = 1;');

    console.log('✅ Tables cleared.');
  }

  async seed(): Promise<void> {
    await this.clearTables();

    // Tablas principales (padres)
    console.log('🌱 Seeding roles...');
    await this.rolesSeeder.run();

    console.log('🌱 Seeding modules...');
    await this.modulesSeeder.run();

    console.log('🌱 Seeding role-module pivot...');
    await this.roleModulesSeeder.run();

    console.log('🌱 Seeding currencies...');
    await this.currencySeeder.run();

    console.log('🌱 Seeding contract types...');
    await this.contractTypeSeeder.run();

    console.log('🌱 Seeding property status...');
    await this.propertyStatusSeeder.run();

    console.log('🌱 Seeding countries...');
    await this.countriesSeeder.run();

    console.log('🌱 Seeding brokers...');
    await this.brokersSeeder.run();

    console.log('🌱 Seeding users...');
    await this.usersSeeder.run();

    console.log('🌱 Seeding property types...');
    await this.propertyTypes.run();

    console.log('🌱 Seeding properties...');
    await this.propertiesSeeder.run();

    // Tablas dependientes
    console.log('🌱 Seeding property views...');
    await this.propertyViews.run();

    console.log('🌱 Seeding property images...');
    await this.propertyImages.run();

    console.log('🌱 Seeding appointments...');
    await this.appointmentSeeder.run();

    console.log('✔ All seeders executed successfully.');
  }
}
