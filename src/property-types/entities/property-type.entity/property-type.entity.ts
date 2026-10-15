// src/property-types/entities/property-type.entity.ts
import { Property } from 'src/properties/entities/property.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('property_types')
export class PropertyType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Property, (property) => property.propertyType)
  properties: Property[];
}
