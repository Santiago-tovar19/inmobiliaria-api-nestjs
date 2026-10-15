import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Module as ModuleEntity } from './entities/module.entity';

import { ModulesService } from './modules.service';
import { ModulesController } from './modules.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ModuleEntity])],
  providers: [ModulesService],
  controllers: [ModulesController],
})
export class ModulesModule {}
