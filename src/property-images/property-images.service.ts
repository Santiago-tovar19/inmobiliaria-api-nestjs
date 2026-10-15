// src/property-images/property-images.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PropertyImage } from '../property-images/entities/property-image.entity/property-image.entity';

@Injectable()
export class PropertyImagesService {
  constructor(
    @InjectRepository(PropertyImage)
    private readonly propertyImageRepo: Repository<PropertyImage>,
  ) {}

  async findAll(): Promise<PropertyImage[]> {
    return this.propertyImageRepo.find({ relations: ['property'] });
  }

  async findOne(id: number): Promise<PropertyImage> {
    const image = await this.propertyImageRepo.findOne({
      where: { id },
      relations: ['property'],
    });
    if (!image) throw new NotFoundException('Imagen no encontrada');
    return image;
  }

  async create(data: Partial<PropertyImage>): Promise<PropertyImage> {
    const newImage = this.propertyImageRepo.create(data);
    return this.propertyImageRepo.save(newImage);
  }

  async update(
    id: number,
    data: Partial<PropertyImage>,
  ): Promise<PropertyImage> {
    const image = await this.findOne(id);
    Object.assign(image, data);
    return this.propertyImageRepo.save(image);
  }

  async remove(id: number): Promise<void> {
    const image = await this.findOne(id);
    await this.propertyImageRepo.remove(image);
  }
}
