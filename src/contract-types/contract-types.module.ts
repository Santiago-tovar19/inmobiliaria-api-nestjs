import { Module } from '@nestjs/common';
import { ContractTypesService } from './contract-types.service';
import { ContractTypesController } from './contract-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractType } from './entities/contract-type.entity/contract-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContractType])],
  providers: [ContractTypesService],
  controllers: [ContractTypesController],
  exports: [TypeOrmModule, ContractTypesService],
})
export class ContractTypesModule {}
