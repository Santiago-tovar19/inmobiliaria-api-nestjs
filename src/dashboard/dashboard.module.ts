// src/dashboard/dashboard.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { User } from 'src/users/entities/user.entity';
import { Property } from 'src/properties/entities/property.entity';
import { PropertyView } from 'src/property-views/entities/property-view.entity/property-view.entity';
import { ApiResponseService } from 'src/common/helpers/api-response.helper';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([User, Property, PropertyView]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService, ApiResponseService],
})
export class DashboardModule {}
