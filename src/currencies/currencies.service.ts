// src/currencies/currencies.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Currency } from './entities/currency.entity/currency.entity';

@Injectable()
export class CurrenciesService {
  constructor(
    @InjectRepository(Currency)
    private readonly currencyRepo: Repository<Currency>,
  ) {}

  async findAll(): Promise<Currency[]> {
    return this.currencyRepo.find();
  }

  async findOne(id: number): Promise<Currency> {
    const currency = await this.currencyRepo.findOne({ where: { id } });
    if (!currency) throw new NotFoundException('Moneda no encontrada');
    return currency;
  }

  async create(data: Partial<Currency>): Promise<Currency> {
    const newCurrency = this.currencyRepo.create(data);
    return this.currencyRepo.save(newCurrency);
  }

  async update(id: number, data: Partial<Currency>): Promise<Currency> {
    const currency = await this.findOne(id);
    Object.assign(currency, data);
    return this.currencyRepo.save(currency);
  }

  async remove(id: number): Promise<void> {
    const currency = await this.findOne(id);
    await this.currencyRepo.remove(currency);
  }
}
