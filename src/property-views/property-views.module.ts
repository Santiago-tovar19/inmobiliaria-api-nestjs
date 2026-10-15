import { Module } from '@nestjs/common';
import { PropertyViewsService } from './property-views.service';
import { PropertyViewsController } from './property-views.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyView } from './entities/property-view.entity/property-view.entity';
import { Property } from 'src/properties/entities/property.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([PropertyView, Property]), UsersModule],
  providers: [PropertyViewsService],
  controllers: [PropertyViewsController],
  exports: [TypeOrmModule, PropertyViewsService],
})
export class PropertyViewsModule {}
