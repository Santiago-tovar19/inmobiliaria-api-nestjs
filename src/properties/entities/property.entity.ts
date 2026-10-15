import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

import { PropertyType } from '../../property-types/entities/property-type.entity/property-type.entity';
import { PropertyStatus } from '../../property-status/entities/property-status.entity/property-status.entity';
import { Currency } from '../../currencies/entities/currency.entity/currency.entity';
import { ContractType } from '../../contract-types/entities/contract-type.entity/contract-type.entity';
import { PropertyImage } from '../../property-images/entities/property-image.entity/property-image.entity';
import { PropertyView } from '../../property-views/entities/property-view.entity/property-view.entity';
import { User } from '../../users/entities/user.entity';
import { Broker } from '../../brokers/entities/broker.entity';
import { Appointment } from 'src/appointments/entitites/appointment.entity';
import { FavUserProperty } from 'src/users/entities/fav-user-property.entity';

@Entity('properties')
export class Property {
  // --------------------------------------------------
  // Básicos
  // --------------------------------------------------
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ type: 'longtext', nullable: true })
  description: string;

  // --------------------------------------------------
  // Relaciones principales
  // --------------------------------------------------
  @ManyToOne(() => PropertyType, { nullable: true })
  @JoinColumn({ name: 'property_type_id' })
  propertyType: PropertyType;

  @ManyToOne(() => PropertyStatus, { nullable: true })
  @JoinColumn({ name: 'status_id' })
  status: PropertyStatus;

  @ManyToOne(() => Currency, { nullable: true })
  @JoinColumn({ name: 'currency_id' })
  currency: Currency;

  @ManyToOne(() => ContractType, { nullable: true })
  @JoinColumn({ name: 'contract_type_id' })
  contractType: ContractType;

  // --------------------------------------------------
  // Datos generales
  // --------------------------------------------------
  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  mls_number: string;

  @Column({ nullable: true })
  construction_year: string;

  @Column({ nullable: true })
  location_type: string;

  @Column({ nullable: true })
  bedrooms: string;

  @Column({ nullable: true })
  bathrooms: string;

  @Column({ nullable: true })
  video: string;

  @Column({ type: 'int', nullable: true })
  size: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  price: string;

  @Column({ nullable: true })
  youtube_link: string;

  // --------------------------------------------------
  // Features (Laravel tinyint)
  // --------------------------------------------------
  @Column({ type: 'tinyint', default: 0 }) parking: number;
  @Column({ type: 'tinyint', default: 0 }) kitchen: number;
  @Column({ type: 'tinyint', default: 0 }) elevator: number;
  @Column({ type: 'tinyint', default: 0 }) wifi: number;
  @Column({ type: 'tinyint', default: 0 }) fireplace: number;
  @Column({ type: 'tinyint', default: 0 }) security: number;
  @Column({ type: 'tinyint', default: 0 }) lobby: number;
  @Column({ type: 'tinyint', default: 0 }) balcony: number;
  @Column({ type: 'tinyint', default: 0 }) terrace: number;
  @Column({ type: 'tinyint', default: 0 }) power_plant: number;
  @Column({ type: 'tinyint', default: 0 }) gym: number;
  @Column({ type: 'tinyint', default: 0 }) walk_in_closet: number;
  @Column({ type: 'tinyint', default: 0 }) swimming_pool: number;
  @Column({ type: 'tinyint', default: 0 }) kids_area: number;
  @Column({ type: 'tinyint', default: 0 }) pets_allowed: number;
  @Column({ type: 'tinyint', default: 0 }) central_air_conditioner: number;

  // Extras Laravel
  @Column({ type: 'tinyint', default: 0 }) hoa: number;
  @Column({ type: 'tinyint', default: 0 }) stories: number;
  @Column({ type: 'tinyint', default: 0 }) exclusions: number;
  @Column({ type: 'tinyint', default: 0 }) level: number;

  // --------------------------------------------------
  // Estado
  // --------------------------------------------------
  @Column({ type: 'tinyint', default: 0 })
  published: number;

  @Column({ type: 'tinyint', default: 0 })
  featured: number;

  // --------------------------------------------------
  // Relaciones secundarias
  // --------------------------------------------------
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @ManyToOne(() => Broker, { nullable: true })
  @JoinColumn({ name: 'broker_id' })
  broker: Broker;

  @OneToMany(() => Appointment, (appointment) => appointment.property)
  appointments: Appointment[];

  @OneToMany(() => PropertyImage, (image) => image.property, { cascade: true })
  images: PropertyImage[];

  @OneToMany(() => PropertyView, (view) => view.property)
  views: PropertyView[];

  @OneToMany(() => FavUserProperty, (fav) => fav.property)
  favUsers: FavUserProperty[];

  // --------------------------------------------------
  // Fechas
  // --------------------------------------------------
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @Column({ nullable: true })
  published_at: Date;

  // --------------------------------------------------
  // Ubicación
  // --------------------------------------------------
  @Column({ nullable: true })
  lat: string;

  @Column({ nullable: true })
  lon: string;
}
