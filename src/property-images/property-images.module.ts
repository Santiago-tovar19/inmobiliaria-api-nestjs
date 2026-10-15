// src/property-images/property-images.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyImagesService } from './property-images.service';
import { PropertyImagesController } from './property-images.controller';
import { PropertyImage } from './entities/property-image.entity/property-image.entity';
import { Property } from 'src/properties/entities/property.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PropertyImage, Property])],
  controllers: [PropertyImagesController],
  providers: [PropertyImagesService],
  exports: [TypeOrmModule, PropertyImagesService],
})
export class PropertyImagesModule {}
