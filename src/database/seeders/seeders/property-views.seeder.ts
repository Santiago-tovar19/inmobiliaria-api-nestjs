import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PropertyView } from 'src/property-views/entities/property-view.entity/property-view.entity';
import { faker } from '@faker-js/faker';
import { Property } from 'src/properties/entities/property.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class PropertyViewsSeeder {
  constructor(
    @InjectRepository(PropertyView)
    private readonly repo: Repository<PropertyView>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Property)
    private readonly propertyRepo: Repository<Property>,
  ) {}

  async run() {
    const users = await this.userRepo.find();
    const properties = await this.propertyRepo.find();

    if (!users.length || !properties.length) return;

    const views: PropertyView[] = [];

    for (let i = 0; i < 200; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomProperty =
        properties[Math.floor(Math.random() * properties.length)];

      views.push(
        this.repo.create({
          user: randomUser,
          property: randomProperty,
          day_of_week: faker.number.int({ min: 0, max: 6 }),
        }),
      );
    }

    await this.repo.save(views);
  }
}
