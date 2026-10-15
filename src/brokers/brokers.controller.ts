import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { BrokersService } from './brokers.service';
import { CreateBrokerDto } from './dto/create-broker.dto';
import { UpdateBrokerDto } from './dto/update-broker.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiResponse } from 'src/common/api-response.interface';
import { Broker } from './entities/broker.entity';

@Controller('brokers')
export class BrokersController {
  constructor(private readonly brokersService: BrokersService) {}

  @Get('get-all')
  async getAllLegacy() {
    return this.brokersService.getAllLegacy();
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.brokersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<ApiResponse<Broker>> {
    return this.brokersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateBrokerDto): Promise<ApiResponse<Broker>> {
    return this.brokersService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateBrokerDto,
  ): Promise<ApiResponse<Broker>> {
    return this.brokersService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.brokersService.remove(id);
  }
}
