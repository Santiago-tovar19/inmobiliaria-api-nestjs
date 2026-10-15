import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersSeeder {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async run() {
    const usersData = [
      {
        first_name: 'José Andrés',
        email: 'andresjosehr@gmail.com',
        password: 'Paralelepipe2',
        brokerId: null,
        roleName: 'Master Admin',
      },
      {
        first_name: 'Admin Master',
        email: 'adminmaster@gmail.com',
        password: 'adminmaster',
        brokerId: null,
        roleName: 'Master Admin',
      },
      {
        first_name: 'Admin',
        email: 'admin@gmail.com',
        password: 'admin',
        brokerId: 1,
        roleName: 'Admin',
      },
      {
        first_name: 'Agente',
        email: 'agente@gmail.com',
        password: 'agente',
        brokerId: null,
        roleName: 'Agente',
      },
      {
        first_name: 'Consumidor',
        email: 'consumidor@gmail.com',
        password: 'consumidor',
        brokerId: null,
        roleName: 'Consumidor',
      },
    ];

    for (const userData of usersData) {
      const existing = await this.repo.findOne({
        where: { email: userData.email },
      });

      if (!existing) {
        // Usamos DeepPartial<User> para que TypeScript no se queje
        const user: DeepPartial<User> & { email_verified_at?: Date } = {
          first_name: userData.first_name,
          email: userData.email,
          password: await bcrypt.hash(userData.password, 10),
          broker: userData.brokerId ? { id: userData.brokerId } : undefined,
          role: { id: await this.getRoleIdByName(userData.roleName) },
          email_verified_at: new Date(), // ✅ Esto ahora es seguro
        };

        await this.repo.save(user);
      }
    }
  }

  private async getRoleIdByName(name: string): Promise<number> {
    const role = await this.repo.manager
      .getRepository('Role')
      .findOne({ where: { name } });
    if (!role) throw new Error(`Role not found: ${name}`);
    return role.id;
  }
}
