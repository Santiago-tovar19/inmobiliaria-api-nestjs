import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from 'src/appointments/entitites/appointment.entity';
import { Property } from 'src/properties/entities/property.entity';
import { faker } from '@faker-js/faker';

@Injectable()
export class AppointmentSeeder {
  constructor(
    @InjectRepository(Appointment)
    private readonly repo: Repository<Appointment>,

    @InjectRepository(Property)
    private readonly propertyRepo: Repository<Property>,
  ) {}

  async run() {
    const properties = await this.propertyRepo.find();
    const propertyIds = properties.map((p) => p.id);

    for (let i = 0; i < 100; i++) {
      await this.repo.save({
        propertyId: propertyIds[Math.floor(Math.random() * propertyIds.length)],
        email: faker.internet.email(),
        phone: faker.phone.number(),
        message: faker.lorem.text(),
        dayOfWeek: faker.number.int({ min: 0, max: 6 }),
      });
    }
  }
}
