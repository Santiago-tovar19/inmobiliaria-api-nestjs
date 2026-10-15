// src/contract-types/contract-types.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContractType } from './entities/contract-type.entity/contract-type.entity';

@Injectable()
export class ContractTypesService {
  constructor(
    @InjectRepository(ContractType)
    private readonly contractTypeRepo: Repository<ContractType>,
  ) {}

  async findAll(): Promise<ContractType[]> {
    return this.contractTypeRepo.find();
  }

  async findOne(id: number): Promise<ContractType> {
    const contractType = await this.contractTypeRepo.findOne({ where: { id } });
    if (!contractType)
      throw new NotFoundException('Tipo de contrato no encontrado');
    return contractType;
  }

  async create(data: Partial<ContractType>): Promise<ContractType> {
    const newType = this.contractTypeRepo.create(data);
    return this.contractTypeRepo.save(newType);
  }

  async update(id: number, data: Partial<ContractType>): Promise<ContractType> {
    const contractType = await this.findOne(id);
    Object.assign(contractType, data);
    return this.contractTypeRepo.save(contractType);
  }

  async remove(id: number): Promise<void> {
    const contractType = await this.findOne(id);
    await this.contractTypeRepo.remove(contractType);
  }
}
