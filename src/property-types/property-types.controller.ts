import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { PropertyTypeService } from './property-types.service';
import { PropertyType } from './entities/property-type.entity/property-type.entity';

@Controller('property-types')
export class PropertyTypeController {
  constructor(private readonly propertyTypeService: PropertyTypeService) {}

  @Get()
  async findAll(): Promise<PropertyType[]> {
    return this.propertyTypeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<PropertyType> {
    return this.propertyTypeService.findOne(id);
  }

  @Post()
  async create(@Body() data: Partial<PropertyType>): Promise<PropertyType> {
    return this.propertyTypeService.create(data);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() data: Partial<PropertyType>,
  ): Promise<PropertyType> {
    return this.propertyTypeService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    await this.propertyTypeService.remove(id);
    return { message: 'Tipo de propiedad eliminado correctamente' };
  }
}
