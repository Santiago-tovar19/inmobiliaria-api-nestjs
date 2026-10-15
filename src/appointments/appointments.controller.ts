import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiResponseService } from 'src/common/helpers/api-response.helper';
import { AppointmentResource } from './resources/appointment.resource';
import { laravelPaginate } from './resources/pagination.resource';
import { User } from 'src/users/entities/user.entity';
import { Appointment } from './entitites/appointment.entity';
import type { AppointmentQuery } from './entities/appointment-query.interface';
import { Request } from 'express';
import { GetAppointmentsQueryDto } from './dto/get-appointments.query';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

interface AppointmentResult {
  data: Appointment[];
  total: number;
}

@UseGuards(JwtAuthGuard)
@Controller('appointments')
export class AppointmentsController {
  constructor(
    private readonly service: AppointmentsService,
    private readonly apiResponse: ApiResponseService,
  ) {}

  // =========================
  // INDEX (Laravel index)
  // =========================
  @Get()
  async index(
    @Req() req: Request & { user: User },
    @Query() query: AppointmentQuery,
  ) {
    const user: User = req.user;

    const page: number = query.page ? Number(query.page) : 1;
    const perPage: number = query.perPage ? Number(query.perPage) : 10;
    const termino: string = query.termino ?? '';

    let result: AppointmentResult;

    if (user.role_id === 1) {
      result = await this.service.findAllForAdmin(termino, perPage, page);
    } else if (user.role_id === 2) {
      result = await this.service.findAllForBroker(
        user.broker_id!,
        termino,
        perPage,
        page,
      );
    } else {
      result = await this.service.findAllForAgent(
        user.id,
        termino,
        perPage,
        page,
      );
    }

    const baseUrl = `${req.protocol}://${req.get('host')}/api/appointments`;

    const pagination = laravelPaginate({
      data: AppointmentResource.collection(result.data),
      total: result.total,
      perPage,
      currentPage: page,
      baseUrl,
    });

    return this.apiResponse.success('Consulta exitosa', pagination);
  }

  // =========================
  // GET ALL FOR RANGE (calendar)
  // =========================
  @Get('get-all-appointments')
  async getAllAppointments(
    @Req() req: Request & { user: User },
    @Query() query: GetAppointmentsQueryDto,
  ) {
    const user = req.user;

    const data = await this.service.getAllForRange(
      query.start,
      query.end,
      user.role_id,
      user.broker_id,
      user.id,
    );

    return this.apiResponse.success(
      'Consulta exitosa',
      AppointmentResource.collection(data),
    );
  }

  // =========================
  // STORE
  // =========================
  @Post()
  async create(@Body() body: CreateAppointmentDto) {
    const today = new Date();

    await this.service.create({
      ...body,
      dayOfWeek: today.getDay(),
    });

    return this.apiResponse.success('Contacto enviado correctamente');
  }
}
