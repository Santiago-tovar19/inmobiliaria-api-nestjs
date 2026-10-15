import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Property } from '../../properties/entities/property.entity';

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Property, (property) => property.appointments)
  @JoinColumn({ name: 'property_id' })
  property: Property;

  @Column({ name: 'property_id', nullable: true })
  propertyId: number;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({ type: 'text', nullable: true })
  message: string;

  @Column({ name: 'day_of_week', nullable: true })
  dayOfWeek: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
