// src/dashboard/dashboard.controller.ts
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiResponseService } from 'src/common/helpers/api-response.helper';
import { User } from 'src/users/entities/user.entity';
import type { Request } from 'express';
import { MoreViewedPropertyResource } from './resources/MoreViewedPropertyResource';

@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
    private readonly apiResponse: ApiResponseService,
  ) {}

  @Get('adminmaster')
  @UseGuards(JwtAuthGuard)
  async getAdminMasterData(@Req() req: Request) {
    const user = req.user as User;

    const data = await this.dashboardService.getAdminMasterData(user);

    return this.apiResponse.success('Exito', {
      ...data,
      moreViewedProperties: MoreViewedPropertyResource.collection(
        data.moreViewedProperties,
      ),
    });

    return this.apiResponse.success('Exito', data);
  }
}
