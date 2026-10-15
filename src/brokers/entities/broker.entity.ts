import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Entity('brokers')
export class Broker {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ nullable: true })
  license_number: string;

  // ✅ Relación inversa: un broker puede tener muchos usuarios
  @OneToMany(() => User, (user) => user.broker)
  users: User[];
}
