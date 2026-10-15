// src/property-images/property-images.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { PropertyImagesService } from './property-images.service';
import { PropertyImage } from '../property-images/entities/property-image.entity/property-image.entity';

@Controller('property-images')
export class PropertyImagesController {
  constructor(private readonly propertyImagesService: PropertyImagesService) {}

  @Get()
  async findAll(): Promise<PropertyImage[]> {
    return this.propertyImagesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<PropertyImage> {
    return this.propertyImagesService.findOne(id);
  }

  @Post()
  async create(@Body() data: Partial<PropertyImage>): Promise<PropertyImage> {
    return this.propertyImagesService.create(data);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() data: Partial<PropertyImage>,
  ): Promise<PropertyImage> {
    return this.propertyImagesService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    await this.propertyImagesService.remove(id);
    return { message: 'Imagen eliminada correctamente' };
  }
}
