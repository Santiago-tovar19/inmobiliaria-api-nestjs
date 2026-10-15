import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Module } from './entities/module.entity';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';

@Injectable()
export class ModulesService {
  constructor(
    @InjectRepository(Module)
    private readonly moduleRepo: Repository<Module>,
  ) {}

  findAll() {
    return this.moduleRepo.find();
  }

  findOne(id: number) {
    return this.moduleRepo.findOneBy({ id });
  }

  create(dto: CreateModuleDto) {
    const newModule = this.moduleRepo.create(dto);
    return this.moduleRepo.save(newModule);
  }

  async update(id: number, dto: UpdateModuleDto) {
    await this.moduleRepo.update(id, dto);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.moduleRepo.delete(id);
  }
}
