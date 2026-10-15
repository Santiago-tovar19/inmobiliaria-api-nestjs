import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Property } from 'src/properties/entities/property.entity';
import { PropertyImage } from 'src/property-images/entities/property-image.entity/property-image.entity';
import { fakerES as faker } from '@faker-js/faker';

@Injectable()
export class PropertiesSeeder {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepo: Repository<Property>,

    @InjectRepository(PropertyImage)
    private readonly imageRepo: Repository<PropertyImage>,

    private readonly dataSource: DataSource,
  ) {}

  async run() {
    // 🔹 Catálogos
    const propertyTypes = (await this.dataSource.query(
      'SELECT id FROM property_types',
    )) as { id: number }[];

    const currencies = (await this.dataSource.query(
      'SELECT id FROM currencies',
    )) as { id: number }[];

    const statuses = (await this.dataSource.query(
      'SELECT id FROM property_status',
    )) as { id: number }[];

    const contractTypes = (await this.dataSource.query(
      'SELECT id FROM contract_types',
    )) as { id: number }[];

    const brokers = (await this.dataSource.query('SELECT id FROM brokers')) as {
      id: number;
    }[];

    if (
      !propertyTypes.length ||
      !currencies.length ||
      !statuses.length ||
      !contractTypes.length
    ) {
      throw new Error('❌ Catálogos incompletos');
    }

    const items: Partial<Property>[] = [];

    // 🔹 PROPERTIES
    for (let i = 0; i < 100; i++) {
      items.push({
        name: faker.lorem.words(3),
        description: faker.lorem.paragraphs(2),
        address: faker.location.streetAddress(),
        mls_number: faker.phone.number(),

        bedrooms: faker.number.int({ min: 1, max: 5 }).toString(),
        bathrooms: faker.number.int({ min: 1, max: 5 }).toString(),
        construction_year: faker.date
          .past({ years: 40 })
          .getFullYear()
          .toString(),

        size: faker.number.int({ min: 50, max: 500 }),
        price: faker.number.int({ min: 1000, max: 500000 }).toString(),

        // 🔹 Flags
        parking: faker.datatype.boolean() ? 1 : 0,
        kitchen: faker.datatype.boolean() ? 1 : 0,
        elevator: faker.datatype.boolean() ? 1 : 0,
        wifi: faker.datatype.boolean() ? 1 : 0,
        fireplace: faker.datatype.boolean() ? 1 : 0,
        security: faker.datatype.boolean() ? 1 : 0,
        lobby: faker.datatype.boolean() ? 1 : 0,
        balcony: faker.datatype.boolean() ? 1 : 0,
        terrace: faker.datatype.boolean() ? 1 : 0,
        power_plant: faker.datatype.boolean() ? 1 : 0,
        gym: faker.datatype.boolean() ? 1 : 0,
        walk_in_closet: faker.datatype.boolean() ? 1 : 0,
        swimming_pool: faker.datatype.boolean() ? 1 : 0,
        kids_area: faker.datatype.boolean() ? 1 : 0,
        pets_allowed: faker.datatype.boolean() ? 1 : 0,
        central_air_conditioner: faker.datatype.boolean() ? 1 : 0,

        // 🔹 Extras Laravel
        hoa: faker.datatype.boolean() ? 1 : 0,
        stories: faker.datatype.boolean() ? 1 : 0,
        exclusions: faker.datatype.boolean() ? 1 : 0,
        level: faker.datatype.boolean() ? 1 : 0,

        published: 1,
        featured: faker.datatype.boolean() ? 1 : 0,
        published_at: new Date(),

        // 🔹 Relaciones
        propertyType: {
          id: faker.helpers.arrayElement(propertyTypes).id,
        } as any,

        currency: {
          id: faker.helpers.arrayElement(currencies).id,
        } as any,

        status: {
          id: faker.helpers.arrayElement(statuses).id,
        } as any,

        contractType: {
          id: faker.helpers.arrayElement(contractTypes).id,
        } as any,

        broker: brokers.length
          ? ({ id: faker.helpers.arrayElement(brokers).id } as any)
          : null,
      });
    }

    const savedProperties = await this.propertyRepo.save(items);

    // 🔹 IMAGES
    for (const property of savedProperties) {
      const images: PropertyImage[] = [];
      const total = faker.number.int({ min: 1, max: 3 });

      for (let i = 0; i < total; i++) {
        images.push(
          this.imageRepo.create({
            property: { id: property.id } as any,
            name: `${faker.number.int({ min: 1, max: 40 })}.jpg`,
            type: i === 0 ? 'Banner' : 'Gallery',
          }),
        );
      }

      await this.imageRepo.save(images);
    }

    console.log('✅ Properties + Images seeded correctamente');
  }
}
