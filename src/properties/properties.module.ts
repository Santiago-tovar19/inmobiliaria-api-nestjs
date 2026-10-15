import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { Property } from './entities/property.entity';
import { PropertyImage } from 'src/property-images/entities/property-image.entity/property-image.entity';
import { PropertyView } from 'src/property-views/entities/property-view.entity/property-view.entity';
import { PropertyType } from 'src/property-types/entities/property-type.entity/property-type.entity';
import { PropertyStatus } from 'src/property-status/entities/property-status.entity/property-status.entity';
import { Currency } from 'src/currencies/entities/currency.entity/currency.entity';
import { ContractType } from 'src/contract-types/entities/contract-type.entity/contract-type.entity';
import { UsersModule } from '../users/users.module';
import { BrokersModule } from '../brokers/brokers.module';
import { PropertyTypesModule } from 'src/property-types/property-types.module';
import { PropertyStatusModule } from 'src/property-status/property-status.module';
import { CurrenciesModule } from 'src/currencies/currencies.module';
import { ContractTypesModule } from 'src/contract-types/contract-types.module';
import { PropertyImagesModule } from 'src/property-images/property-images.module';
import { PropertyViewsModule } from 'src/property-views/property-views.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Property,
      PropertyImage,
      PropertyView,
      PropertyType,
      PropertyStatus,
      Currency,
      ContractType,
    ]),
    UsersModule,
    BrokersModule,
    PropertyTypesModule,
    PropertyStatusModule,
    CurrenciesModule,
    ContractTypesModule,
    PropertyImagesModule,
    PropertyViewsModule,
  ],
  controllers: [PropertiesController],
  providers: [PropertiesService],
  exports: [TypeOrmModule, PropertiesService],
})
export class PropertiesModule {}
