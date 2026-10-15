import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
  NotFoundException,
  ForbiddenException,
  ParseIntPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import type { Request } from 'express';

import { PropertiesService } from './properties.service';
import { Property } from './entities/property.entity';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Public } from 'src/auth/decorators/public.decorator';

import { User } from '../users/entities/user.entity';
import { ApiResponseService } from 'src/common/helpers/api-response.helper';
import { PropertyViewsService } from 'src/property-views/property-views.service';
import { PropertyResource } from './resources/property.resource';

@UseGuards(JwtAuthGuard)
@Controller('properties')
export class PropertiesController {
  constructor(
    private readonly propertiesService: PropertiesService,
    private readonly propertyViewsService: PropertyViewsService,
    private readonly apiResponse: ApiResponseService,
  ) {}

  // ======================================================
  // 🔓 PUBLIC ROUTES
  // ======================================================

  // -------- Listado de propiedades (Laravel paginator)
  @Public()
  @Get()
  async findAll(@Query() query: any, @Req() req: Request) {
    const user = req.user as User | undefined;
    const perPage = query.perPage ? Number(query.perPage) : 10;

    const result = await this.propertiesService.findAll(query, user, perPage);

    // 👇 YA viene en formato Laravel
    return this.apiResponse.success('Consulta Exitosa', result);
  }

  // -------- Propiedades destacadas

  @Public()
  @Get('get-feature-properties')
  async getFeaturesProperties(@Query('property_id') propertyId?: string) {
    const id = propertyId ? Number(propertyId) : undefined;
    const properties = await this.propertiesService.getFeatureProperties(id);

    return this.apiResponse.success(
      'Consulta Exitosa',
      PropertyResource.collection(properties),
    );
  }

  @Get('get-property-views')
  async getPropertyViews(
    @Req() req: Request,
    @Query('start') start?: string,
    @Query('end') end?: string,
  ) {
    const user = req.user as User;

    const views = await this.propertyViewsService.getPropertyViewsLegacy(
      user,
      start,
      end,
    );

    return this.apiResponse.success('Consulta Exitosa', views);
  }

  @Post('register-view')
  async registerView(@Body() body: { propertyID: number; userID: number }) {
    const view = await this.propertyViewsService.registerViewLegacy(
      body.userID,
      body.propertyID,
    );

    return this.apiResponse.success(
      'Consulta Exitosa, se guardó la visita',
      view,
    );
  }

  @Public()
  @Get('get-features')
  async getFeatures() {
    const data = await this.propertiesService.getFeatures();
    return this.apiResponse.success('Consulta exitosa', data);
  }

  @Public()
  @Get('get-property-types')
  async getPropertyTypes() {
    const types = await this.propertiesService.getPropertyTypes();
    return this.apiResponse.success('Consulta exitosa', types);
  }

  // -------- Obtener una propiedad
  @Public()
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const user = req.user as User | undefined;
    const isAdmin = user?.role?.id === 1;

    const property = await this.propertiesService.findOne(id, isAdmin);

    return this.apiResponse.success('Consulta Exitosa', property);
  }

  // -------- Datos para formularios

  // -------- Tipos de propiedad con count

  // ======================================================
  // 🔒 PRIVATE ROUTES
  // ======================================================

  // -------- Vistas de propiedades (LEGACY Laravel)

  // -------- Registrar vista (legacy frontend)
  // -------- Crear propiedad
  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  async create(
    @Body() body: any,
    @UploadedFiles() images: Express.Multer.File[],
    @Req() req: Request,
  ) {
    const user = req.user as User;

    const property = new Property();
    Object.assign(property, body);
    property.createdBy = user;

    const saved = await this.propertiesService.create(
      property,
      images,
      [],
      null,
    );

    return this.apiResponse.success('Propiedad creada con éxito', saved);
  }

  // -------- Actualizar propiedad
  @Patch(':id')
  @UseInterceptors(FilesInterceptor('images'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
    @UploadedFiles() images: Express.Multer.File[],
    @Req() req: Request,
  ) {
    const user = req.user as User;
    const isAdmin = user.role.id === 1;

    const entity = await this.propertiesService.findOne(id, true);

    if (!entity) {
      throw new NotFoundException('Propiedad no encontrada');
    }

    if (!isAdmin && entity.created_by !== user.id) {
      throw new ForbiddenException(
        'No tienes permiso para editar esta propiedad',
      );
    }

    const updated = await this.propertiesService.update(
      entity as any,
      body,
      images,
      [],
      null,
      [],
    );

    return this.apiResponse.success(
      'Propiedad actualizada correctamente',
      updated,
    );
  }

  // -------- Eliminar propiedad
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.propertiesService.remove(id);
    return this.apiResponse.success('Propiedad eliminada correctamente');
  }
}
