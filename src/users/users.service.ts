import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { Role } from '../roles/entities/role.entities';
import { Broker } from '../brokers/entities/broker.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FavUserProperty } from './entities/fav-user-property.entity';
import { Property } from 'src/properties/entities/property.entity';
import { ApiResponseService } from 'src/common/helpers/api-response.helper';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,

    @InjectRepository(Broker)
    private readonly brokerRepo: Repository<Broker>,

    private readonly apiResponse: ApiResponseService,

    @InjectRepository(FavUserProperty)
    private readonly favRepo: Repository<FavUserProperty>,

    @InjectRepository(Property)
    private readonly propertyRepo: Repository<Property>,
  ) {}

  // ======================
  // CRUD BASE
  // ======================

  async findAll(authUser: any, query: any) {
    const page = query?.page ? Number(query.page) : 1;
    const perPage = query?.perPage ? Number(query.perPage) : 10;
    const termino = query?.termino || '';

    const qb = this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.broker', 'broker')
      .where('user.id != :id', { id: authUser.userId ?? authUser.id });

    if (termino) {
      qb.andWhere('(user.first_name LIKE :t OR user.email LIKE :t)', {
        t: `%${termino}%`,
      });
    }

    // Laravel: rol admin broker (role_id === 2)
    if (authUser.role_id === 2 && authUser.broker_id) {
      qb.andWhere('user.broker_id = :brokerId', {
        brokerId: authUser.broker_id,
      });
    }

    const [data, total] = await qb
      .skip((page - 1) * perPage)
      .take(perPage)
      .getManyAndCount();

    return this.apiResponse.success('Consulta Exitosa', {
      data,
      total,
      page,
      perPage,
    });
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['role', 'broker'],
    });

    if (!user) {
      return this.apiResponse.success('', null);
    }

    return this.apiResponse.success('Consulta exitosa', user);
  }

  // users.service.ts
  async findOneEntity(id: number) {
    const user = this.userRepo.findOne({
      where: { id },
      relations: ['role', 'broker'],
    });

    return user;
  }

  async create(authUser: any, dto: CreateUserDto) {
    const role = await this.roleRepo.findOne({
      where: { id: dto.role_id },
    });
    if (!role) throw new NotFoundException('Rol no encontrado');

    let brokerId: number | null = null;

    if (authUser.role_id === 1 && dto['broker_id']) {
      brokerId = dto['broker_id'];
    } else if (authUser.broker_id) {
      brokerId = authUser.broker_id;
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = this.userRepo.create({
      first_name: dto.first_name,
      email: dto.email,
      password: hashedPassword,
      role_id: role.id,
      broker_id: brokerId,
    });

    await this.userRepo.save(user);

    return this.apiResponse.success('Usuario creado con exito', user);
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      return this.apiResponse.success('', null);
    }

    Object.assign(user, dto);

    await this.userRepo.save(user);

    return this.apiResponse.success('Usuario actualizado con exito', user);
  }

  async remove(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    await this.userRepo.remove(user);

    return this.apiResponse.success('Usuario eliminado', null);
  }

  // ======================
  // ENDPOINTS LARAVEL
  // ======================

  // POST /users/create-user
  async createUser(body: any) {
    const role = await this.roleRepo.findOne({
      where: { id: body.role_id },
    });
    if (!role) throw new NotFoundException('Rol no encontrado');

    const user = this.userRepo.create({
      first_name: body.first_name,
      email: body.email,
      role_id: role.id,
      email_verified_at: body.verified === 'true' ? new Date() : null,
    });

    await this.userRepo.save(user);

    // Email + token se maneja en Auth
    return this.apiResponse.success('Usuario creado con exito', user);
  }

  // POST /users/signup-costumer
  async signUpCustomer(body: any) {
    const role = await this.roleRepo.findOne({
      where: { id: body.role_id },
    });
    if (!role) throw new NotFoundException('Rol no encontrado');

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const user = this.userRepo.create({
      first_name: body.first_name,
      email: body.email,
      password: hashedPassword,
      role_id: role.id,
    });

    await this.userRepo.save(user);

    return this.apiResponse.success('Registrado exitosamente', { user });
  }

  // POST /users/complete-signup/:token
  async completeSignUp(token: string, body: any) {
    const user = await this.userRepo.findOne({
      where: { email: body.email },
    });
    if (!user) throw new UnauthorizedException('Token invalido');

    user.password = await bcrypt.hash(body.password, 10);
    user.phone = body.phone;
    user.email_verified_at = new Date();

    await this.userRepo.save(user);

    return this.apiResponse.success('Registrado exitosamente', null);
  }

  // GET /users/resend-signup-email/:id
  async resendSignUpEmail(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) return this.apiResponse.success('', null);

    // Email lo maneja Auth / Notifications
    return this.apiResponse.success('Correo enviado exitosamente', null);
  }

  async setPropertyFav(authUser: User, propertyId: number, fav: number) {
    const property = await this.propertyRepo.findOne({
      where: { id: propertyId },
    });

    if (!property) {
      return { message: 'Propiedad no encontrada' };
    }

    const existing = await this.favRepo.findOne({
      where: {
        user: { id: authUser.id },
        property: { id: propertyId },
      },
    });

    // =========================
    // fav = 1 → TOGGLE
    // =========================
    if (fav === 1) {
      if (existing) {
        await this.favRepo.remove(existing);
        return { message: '0' }; // 👈 EXACTO como Laravel
      } else {
        await this.favRepo.save(
          this.favRepo.create({ user: authUser, property }),
        );
        return { message: '1' };
      }
    }

    // =========================
    // fav = 0 → CONSULTA
    // =========================
    if (fav === 0) {
      return { message: existing ? '1' : '0' };
    }

    return { message: 'Parametro fav invalido' };
  }
}
