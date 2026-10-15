// src/property-views/entities/property-view.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Property } from 'src/properties/entities/property.entity';
import { User } from 'src/users/entities/user.entity';

@Entity('property_views')
export class PropertyView {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  property_id: number;

  @ManyToOne(() => Property, (property) => property.views, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'property_id' })
  property: Property;

  @Column({ nullable: true })
  user_id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'int', nullable: true })
  day_of_week: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
