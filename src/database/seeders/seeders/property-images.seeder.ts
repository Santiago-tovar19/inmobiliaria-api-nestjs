import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PropertyImage } from 'src/property-images/entities/property-image.entity/property-image.entity';
import { faker } from '@faker-js/faker';

@Injectable()
export class PropertyImagesSeeder {
  constructor(
    @InjectRepository(PropertyImage)
    private readonly repo: Repository<PropertyImage>,
  ) {}

  async run() {
    const images: Partial<PropertyImage>[] = [];

    for (let i = 1; i <= 50; i++) {
      images.push(
        this.repo.create({
          name: `Imagen de propiedad ${i}`,
          property_id: i,
          type: faker.helpers.arrayElement(['Banner', 'Gallery']),
        }),
      );
    }

    await this.repo.save(images);
  }
}
