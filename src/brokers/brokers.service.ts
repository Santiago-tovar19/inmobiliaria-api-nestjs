import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Broker } from './entities/broker.entity';
import { CreateBrokerDto } from './dto/create-broker.dto';
import { UpdateBrokerDto } from './dto/update-broker.dto';
import { ApiResponseService } from 'src/common/helpers/api-response.helper';
import { ApiResponse } from 'src/common/api-response.interface';

@Injectable()
export class BrokersService {
  constructor(
    @InjectRepository(Broker)
    private readonly brokerRepo: Repository<Broker>,
    private readonly apiResponse: ApiResponseService,
  ) {}

  async getAllLegacy(): Promise<ApiResponse<Broker[]>> {
    const brokers: Broker[] = await this.brokerRepo.find();

    return this.apiResponse.success<Broker[]>('Success', brokers);
  }

  async findAll(): Promise<ApiResponse<Broker[]>> {
    const brokers: Broker[] = await this.brokerRepo.find();

    return this.apiResponse.success<Broker[]>('Consulta exitosa', brokers);
  }

  async findOne(id: number): Promise<ApiResponse<Broker>> {
    const broker: Broker | null = await this.brokerRepo.findOne({
      where: { id },
    });
    if (!broker) {
      throw new NotFoundException(`Broker ${id} no encontrado`);
    }
    return this.apiResponse.success<Broker>('Consulta exitosa', broker);
  }

  async create(dto: CreateBrokerDto): Promise<ApiResponse<Broker>> {
    const broker: Broker = this.brokerRepo.create(dto);

    const savedBroker: Broker = await this.brokerRepo.save(broker);

    return this.apiResponse.success<Broker>(
      'Broker creado correctamente',
      savedBroker,
    );
  }

  async update(id: number, dto: UpdateBrokerDto): Promise<ApiResponse<Broker>> {
    const broker: Broker | undefined = await this.brokerRepo.preload({
      id,
      ...dto,
    });
    if (!broker) {
      throw new NotFoundException(`Broker ${id} no encontrado`);
    }

    const updatedBroker: Broker = await this.brokerRepo.save(broker);

    return this.apiResponse.success<Broker>(
      'Broker actualizado correctamente',
      updatedBroker,
    );
  }

  async remove(id: number): Promise<ApiResponse<null>> {
    const broker: Broker | null = await this.brokerRepo.findOne({
      where: { id },
    });

    if (!broker) {
      throw new NotFoundException(`Broker ${id} no encontrado`);
    }

    await this.brokerRepo.remove(broker);

    return this.apiResponse.success<null>(
      'Broker eliminado correctamente',
      null,
    );
  }
}
