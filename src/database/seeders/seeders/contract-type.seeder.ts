import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContractType } from 'src/contract-types/entities/contract-type.entity/contract-type.entity';

@Injectable()
export class ContractTypeSeeder {
  constructor(
    @InjectRepository(ContractType)
    private readonly repo: Repository<ContractType>,
  ) {}

  async run() {
    const contractTypes = [
      { name: 'Venta' },
      { name: 'Alquiler' },
      { name: 'Traspaso' },
    ];

    await this.repo.save(contractTypes);
  }
}
