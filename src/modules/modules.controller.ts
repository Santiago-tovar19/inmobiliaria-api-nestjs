import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { ModulesService } from './modules.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { ApiResponseService } from '../common/helpers/api-response.helper';

@Controller('modules')
export class ModulesController {
  constructor(
    private readonly modulesService: ModulesService,
    private readonly apiResponse: ApiResponseService,
  ) {}

  @Get()
  async findAll() {
    const data = await this.modulesService.findAll();
    return this.apiResponse.success('Consulta exitosa', data);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.modulesService.findOne(id);
    return this.apiResponse.success('Consulta exitosa', data);
  }

  @Post()
  async create(@Body() dto: CreateModuleDto) {
    const data = await this.modulesService.create(dto);
    return this.apiResponse.success('Módulo creado con éxito', data);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateModuleDto) {
    const data = await this.modulesService.update(id, dto);
    return this.apiResponse.success('Módulo actualizado con éxito', data);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.modulesService.remove(id);
    return this.apiResponse.success('Módulo eliminado con éxito');
  }
}
