import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// ENTIDADES necesarias por TODOS los seeders
import { Role } from 'src/roles/entities/role.entities';
import { Module as AppModule } from 'src/modules/entities/module.entity';

import { PropertyStatus } from 'src/property-status/entities/property-status.entity/property-status.entity';
import { Currency } from 'src/currencies/entities/currency.entity/currency.entity';
import { ContractType } from 'src/contract-types/entities/contract-type.entity/contract-type.entity';

import { Country } from 'src/countries/entities/country.entity';
import { User } from 'src/users/entities/user.entity';
import { Broker } from 'src/brokers/entities/broker.entity';

import { PropertyType } from 'src/property-types/entities/property-type.entity/property-type.entity';
import { PropertyView } from 'src/property-views/entities/property-view.entity/property-view.entity';
import { Property } from 'src/properties/entities/property.entity';
import { PropertyImage } from 'src/property-images/entities/property-image.entity/property-image.entity';

import { Appointment } from 'src/appointments/entitites/appointment.entity';

// SEEDERS
import { SeederService } from '../database.service';

import { RolesSeeder } from './seeders/roles.seeder';
import { ModulesSeeder } from './seeders/modules.seeder';
import { RoleModulesSeeder } from './seeders/module-role.seeder';
import { PropertyStatusSeeder } from './seeders/property-status.seeder';
import { CurrenciesSeeder } from './seeders/currencies.seeder';
import { ContractTypeSeeder } from './seeders/contract-type.seeder';
import { UsersSeeder } from './seeders/users.seeder';
import { CountriesSeeder } from './seeders/countries.seeder';
import { BrokersSeeder } from './seeders/brokers.seeder';
import { PropertyTypesSeeder } from './seeders/property-types.seeder';
import { PropertyViewsSeeder } from './seeders/property-views.seeder';
import { PropertiesSeeder } from './seeders/properties.seeder';
import { PropertyImagesSeeder } from './seeders/property-images.seeder';
import { AppointmentSeeder } from './seeders/appointment.seeder';
import { SeederCommand } from './seeder.command';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Role,
      AppModule,

      Currency,
      ContractType,
      PropertyStatus,

      Country,
      User,
      Broker,

      PropertyType,
      PropertyView,
      Property,
      PropertyImage,

      Appointment,
    ]),
  ],
  providers: [
    SeederService,

    SeederCommand,

    RolesSeeder,
    ModulesSeeder,
    RoleModulesSeeder,

    PropertyStatusSeeder,
    CurrenciesSeeder,
    ContractTypeSeeder,

    UsersSeeder,
    CountriesSeeder,
    BrokersSeeder,

    PropertyTypesSeeder,
    PropertyViewsSeeder,
    PropertiesSeeder,
    PropertyImagesSeeder,

    AppointmentSeeder,
  ],
  exports: [SeederService],
})
export class SeederModule {}
