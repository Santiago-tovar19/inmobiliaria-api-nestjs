import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiResponseService } from '../common/helpers/api-response.helper';
import type { Request } from 'express';
import { User } from 'src/users/entities/user.entity';

@UseGuards(JwtAuthGuard)
@Controller()
export class EntityPropertiesController {
  constructor(
    private readonly rolesService: RolesService,
    private readonly apiResponse: ApiResponseService,
  ) {}

  // Laravel compatible
  // GET /get-all-roles
  @Get('get-all-roles')
  async getAllRoles(@Req() req: Request) {
    const user = req.user as User;

    const roles = await this.rolesService.findAllRaw();

    const filtered =
      user.role_id === 1 ? roles : roles.filter((r) => r.id !== 1);

    return this.apiResponse.success('Éxito', filtered);
  }
}
