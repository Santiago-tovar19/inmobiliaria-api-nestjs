import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Broker } from 'src/brokers/entities/broker.entity';
import { faker } from '@faker-js/faker';

@Injectable()
export class BrokersSeeder {
  constructor(
    @InjectRepository(Broker)
    private readonly repo: Repository<Broker>,
  ) {}

  async run() {
    const brokers: Partial<Broker>[] = [];

    for (let i = 0; i < 10; i++) {
      brokers.push({
        name: faker.person.fullName(),
        phone: faker.phone.number(),
        email: faker.internet.email(),
        address: faker.location.streetAddress(), // si lo quieres
      });
    }

    await this.repo.save(brokers);
  }
}
