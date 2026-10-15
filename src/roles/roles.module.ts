import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Role } from './entities/role.entities';
import { EntityPropertiesController } from './entity-properties.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  controllers: [RolesController, EntityPropertiesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
