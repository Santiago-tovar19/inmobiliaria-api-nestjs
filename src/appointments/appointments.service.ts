import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Appointment } from './entitites/appointment.entity';
import { Property } from '../properties/entities/property.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly repo: Repository<Appointment>,

    @InjectRepository(Property)
    private readonly propertyRepo: Repository<Property>,
  ) {}

  // ==================================================
  // ADMIN
  // ==================================================
  async findAllForAdmin(termino: string, perPage: number, page: number) {
    const qb = this.repo
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.property', 'property');

    if (termino) {
      qb.where('(a.email LIKE :t OR a.phone LIKE :t OR a.message LIKE :t)', {
        t: `%${termino}%`,
      });
    }

    const [data, total] = await qb
      .skip((page - 1) * perPage)
      .take(perPage)
      .getManyAndCount();

    return { data, total };
  }

  // ==================================================
  // BROKER
  // ==================================================
  async findAllForBroker(
    brokerId: number,
    termino: string | null,
    perPage: number,
    page: number,
  ) {
    if (!brokerId) {
      throw new BadRequestException('Broker inválido');
    }

    const properties = await this.propertyRepo.find({
      where: { broker: { id: brokerId } },
      select: ['id'],
    });

    if (!properties.length) {
      throw new NotFoundException('Este broker no tiene propiedades asociadas');
    }

    const ids = properties.map((p) => p.id);

    const query = this.repo
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.property', 'property')
      .where('property.id IN (:...ids)', { ids });

    if (termino) {
      query.andWhere(
        '(a.email LIKE :t OR a.phone LIKE :t OR a.message LIKE :t)',
        { t: `%${termino}%` },
      );
    }

    return this.paginate(query, perPage, page);
  }

  // ==================================================
  // AGENT
  // ==================================================
  async findAllForAgent(
    agentId: number,
    termino: string | null,
    perPage: number,
    page: number,
  ) {
    if (!agentId) {
      throw new BadRequestException('Agente inválido');
    }

    const properties = await this.propertyRepo.find({
      where: { createdBy: { id: agentId } },
      select: ['id'],
    });

    if (!properties.length) {
      throw new NotFoundException('Este agente no tiene propiedades asociadas');
    }

    const ids = properties.map((p) => p.id);

    const query = this.repo
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.property', 'property')
      .where('property.id IN (:...ids)', { ids });

    if (termino) {
      query.andWhere(
        '(a.email LIKE :t OR a.phone LIKE :t OR a.message LIKE :t)',
        { t: `%${termino}%` },
      );
    }

    return this.paginate(query, perPage, page);
  }

  // ==================================================
  // CREATE (store)
  // ==================================================
  async create(data: Partial<Appointment>) {
    if (!data.propertyId) {
      throw new BadRequestException('property_id es requerido');
    }

    if (!data.email) {
      throw new BadRequestException('Email es requerido');
    }

    if (!data.phone) {
      throw new BadRequestException('Teléfono es requerido');
    }

    const appointment = this.repo.create(data);
    return this.repo.save(appointment);
  }

  // ==================================================
  // RANGE (CALENDAR)
  // ==================================================
  async getAllForRange(
    start: string | undefined,
    end: string | undefined,
    roleId: number | null,
    brokerId?: number | null,
    agentId?: number,
  ) {
    const query = this.repo
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.property', 'property');

    if (roleId === 2) {
      if (!brokerId) {
        throw new BadRequestException('Broker inválido');
      }
      query.where('property.broker_id = :b', { b: brokerId });
    }

    if (roleId === 3) {
      if (!agentId) {
        throw new BadRequestException('Agente inválido');
      }
      query.where('property.created_by = :a', { a: agentId });
    }

    if (start && end) {
      query.andWhere('a.created_at BETWEEN :start AND :end', {
        start,
        end,
      });
    }

    return query.getMany();
  }

  // ==================================================
  // PAGINATOR (Laravel-style BASE)
  // ==================================================
  private async paginate(
    query: SelectQueryBuilder<Appointment>,
    perPage: number,
    page: number,
  ) {
    const [data, total] = await query
      .skip((page - 1) * perPage)
      .take(perPage)
      .getManyAndCount();

    return {
      data,
      current_page: page,
      per_page: perPage,
      total,
      last_page: Math.ceil(total / perPage),
    };
  }
}
