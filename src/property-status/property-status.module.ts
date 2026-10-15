import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyStatus } from './entities/property-status.entity/property-status.entity';
import { PropertyStatusService } from './property-status.service';
import { PropertyStatusController } from './property-status.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PropertyStatus])],
  controllers: [PropertyStatusController],
  providers: [PropertyStatusService],
  exports: [TypeOrmModule, PropertyStatusService],
})
export class PropertyStatusModule {}
