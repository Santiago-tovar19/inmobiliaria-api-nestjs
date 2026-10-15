import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { PropertyViewsService } from './property-views.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiResponseService } from 'src/common/helpers/api-response.helper';

@UseGuards(JwtAuthGuard)
@Controller('property-views')
export class PropertyViewsController {
  constructor(
    private readonly propertyViewsService: PropertyViewsService,
    private readonly apiResponse: ApiResponseService,
  ) {}

  // Contar vistas de una propiedad
  @Get('count/:propertyId')
  async count(@Param('propertyId') propertyId: number) {
    const count = await this.propertyViewsService.countViews(propertyId);
    return this.apiResponse.success('Vistas totales', { count });
  }

  // Listar vistas de una propiedad, opcional por rango de fechas
  @Get('list/:propertyId')
  async list(
    @Param('propertyId') propertyId: number,
    @Query('start') start?: string,
    @Query('end') end?: string,
  ) {
    const startDate = start ? new Date(start) : undefined;
    const endDate = end ? new Date(end) : undefined;

    const views = await this.propertyViewsService.listViews(
      propertyId,
      startDate,
      endDate,
    );

    return this.apiResponse.success('Vistas registradas', views);
  }
}
