// src/currencies/currencies.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { Currency } from './entities/currency.entity/currency.entity';

@Controller('currencies')
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) {}

  @Get()
  findAll(): Promise<Currency[]> {
    return this.currenciesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Currency> {
    return this.currenciesService.findOne(+id);
  }

  @Post()
  create(@Body() data: Partial<Currency>): Promise<Currency> {
    return this.currenciesService.create(data);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() data: Partial<Currency>,
  ): Promise<Currency> {
    return this.currenciesService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.currenciesService.remove(+id);
  }
}
