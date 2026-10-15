import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entities';

@Entity('modules')
export class Module {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ nullable: true })
  path: string;

  @Column({ nullable: true })
  father_id?: number | null;

  @ManyToOne(() => Module)
  @JoinColumn({ name: 'father_id' })
  parent: Module;

  @ManyToMany(() => Role, (role) => role.modules)
  @JoinTable({
    name: 'role_modules',
    joinColumn: { name: 'module_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];
}
