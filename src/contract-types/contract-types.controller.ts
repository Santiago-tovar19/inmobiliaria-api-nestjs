// src/contract-types/contract-types.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ContractTypesService } from './contract-types.service';
import { ContractType } from './entities/contract-type.entity/contract-type.entity';

@Controller('contract-types')
export class ContractTypesController {
  constructor(private readonly contractTypesService: ContractTypesService) {}

  @Get()
  findAll(): Promise<ContractType[]> {
    return this.contractTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<ContractType> {
    return this.contractTypesService.findOne(+id);
  }

  @Post()
  create(@Body() data: Partial<ContractType>): Promise<ContractType> {
    return this.contractTypesService.create(data);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() data: Partial<ContractType>,
  ): Promise<ContractType> {
    return this.contractTypesService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.contractTypesService.remove(+id);
  }
}
