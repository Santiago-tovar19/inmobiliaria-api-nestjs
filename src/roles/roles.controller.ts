import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiResponse } from '../common/api-response.interface';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  findAll(): Promise<ApiResponse> {
    return this.rolesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<ApiResponse> {
    return this.rolesService.findOne(id);
  }

  @Post()
  create(@Body() createRoleDto: CreateRoleDto): Promise<ApiResponse> {
    return this.rolesService.create(createRoleDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<ApiResponse> {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<ApiResponse> {
    return this.rolesService.remove(id);
  }
}
