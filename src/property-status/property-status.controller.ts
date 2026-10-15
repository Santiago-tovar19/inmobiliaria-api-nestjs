import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { PropertyStatusService } from './property-status.service';
import { PropertyStatus } from './entities/property-status.entity/property-status.entity';

@Controller('property-status')
export class PropertyStatusController {
  constructor(private readonly propertyStatusService: PropertyStatusService) {}

  @Get()
  async findAll(): Promise<PropertyStatus[]> {
    return this.propertyStatusService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<PropertyStatus> {
    return this.propertyStatusService.findOne(id);
  }

  @Post()
  async create(@Body() data: Partial<PropertyStatus>): Promise<PropertyStatus> {
    return this.propertyStatusService.create(data);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() data: Partial<PropertyStatus>,
  ): Promise<PropertyStatus> {
    return this.propertyStatusService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    await this.propertyStatusService.remove(id);
    return { message: 'Estado eliminado correctamente' };
  }
}
