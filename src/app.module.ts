import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config'; // 🔹 importar ConfigModule
import { TestModule } from './test/test.module';
import { RolesModule } from './roles/roles.module';
import { ModulesModule } from './modules/modules.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { BrokersModule } from './brokers/brokers.module';
import { PropertyTypesModule } from './property-types/property-types.module';
import { PropertyStatusModule } from './property-status/property-status.module';
import { CurrenciesModule } from './currencies/currencies.module';
import { ContractTypesModule } from './contract-types/contract-types.module';
import { PropertyImagesModule } from './property-images/property-images.module';
import { PropertyViewsModule } from './property-views/property-views.module';
import { UsersModule } from './users/users.module';
import { CommandModule } from 'nestjs-command';
import { SeederModule } from './database/seeders/seeder.module';
import { CountriesModule } from './countries/countries.module';

import { AppointmentsModule } from './appointments/appointments.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { PropertiesModule } from './properties/properties.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // 🔹 global para toda la app
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'inmobiliaria_db',
      autoLoadEntities: true,
      synchronize: true, // ⚠️ mantener false en producción
    }),
    AuthModule,
    TestModule,
    PropertiesModule,
    RolesModule,
    ModulesModule,
    CommonModule,
    BrokersModule,
    PropertyTypesModule,
    PropertyStatusModule,
    CurrenciesModule,
    ContractTypesModule,
    PropertyImagesModule,
    PropertyViewsModule,
    UsersModule,
    CommandModule,
    SeederModule,
    CountriesModule,
    AppointmentsModule,
    DashboardModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
