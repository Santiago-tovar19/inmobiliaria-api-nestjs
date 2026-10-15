import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entities';
import { Broker } from 'src/brokers/entities/broker.entity';
import { FavUserProperty } from './fav-user-property.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column() // password no puede ser null (igual que Laravel)
  password: string;

  // 🔥 Nombres compatibles con la base de datos
  @Column({ nullable: true })
  broker_id: number | null;

  @ManyToOne(() => Broker, (broker) => broker.users, { nullable: true })
  @JoinColumn({ name: 'broker_id' })
  broker?: Broker;

  @Column()
  role_id: number;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column({ nullable: true })
  img: string;

  @Column({ type: 'timestamp', nullable: true })
  email_verified_at?: Date | null;

  @OneToMany(() => FavUserProperty, (fav) => fav.user)
  favProperties: FavUserProperty[];
}
