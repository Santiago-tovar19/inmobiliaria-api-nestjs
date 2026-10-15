import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entities';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiResponse } from '../common/api-response.interface';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
  ) {}

  async findAll(): Promise<ApiResponse> {
    const roles = await this.roleRepo.find({ relations: ['modules'] });
    return {
      message: 'Roles obtenidos exitosamente',
      statusCode: 200,
      data: roles,
    };
  }

  async findAllRaw(): Promise<Role[]> {
    return this.roleRepo.find();
  }

  async findOne(id: number): Promise<ApiResponse> {
    const role = await this.roleRepo.findOne({
      where: { id },
      relations: ['modules'],
    });
    if (!role) {
      return {
        message: `Role ${id} no encontrado`,
        statusCode: 404,
        data: null,
      };
    }
    return { message: 'Role obtenido', statusCode: 200, data: role };
  }

  async create(createRoleDto: CreateRoleDto): Promise<ApiResponse> {
    const role = this.roleRepo.create(createRoleDto);
    const savedRole = await this.roleRepo.save(role);
    return {
      message: 'Role creado exitosamente',
      statusCode: 201,
      data: savedRole,
    };
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<ApiResponse> {
    const role = await this.roleRepo.preload({
      id,
      ...updateRoleDto,
    });
    if (!role) {
      return {
        message: `Role ${id} no encontrado`,
        statusCode: 404,
        data: null,
      };
    }
    const updatedRole = await this.roleRepo.save(role);
    return {
      message: 'Role actualizado exitosamente',
      statusCode: 200,
      data: updatedRole,
    };
  }

  async remove(id: number): Promise<ApiResponse> {
    const role = await this.roleRepo.findOne({ where: { id } });
    if (!role) {
      return {
        message: `Role ${id} no encontrado`,
        statusCode: 404,
        data: null,
      };
    }
    await this.roleRepo.remove(role);
    return {
      message: 'Role eliminado exitosamente',
      statusCode: 200,
      data: null,
    };
  }
}
