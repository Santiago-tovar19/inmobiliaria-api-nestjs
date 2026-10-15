import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Currency } from 'src/currencies/entities/currency.entity/currency.entity';

@Injectable()
export class CurrenciesSeeder {
  constructor(
    @InjectRepository(Currency)
    private readonly repo: Repository<Currency>,
  ) {}

  async run() {
    const items = [
      { code: 'USD', name: 'US Dollar' },
      { code: 'PAB', name: 'Panamanian Balboa' },
      { code: 'CRC', name: 'Costa Rican Colón' },
    ];

    await this.repo.save(items);
  }
}
