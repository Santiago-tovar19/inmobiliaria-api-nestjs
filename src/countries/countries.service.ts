import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from './entities/country.entity';

@Injectable()
export class CountriesService {
  constructor(
    @InjectRepository(Country)
    private readonly repo: Repository<Country>,
  ) {}

  async findAll(): Promise<Country[]> {
    return this.repo.find({
      order: { name: 'ASC' }, // ordenado como en el backend anterior
    });
  }
}
