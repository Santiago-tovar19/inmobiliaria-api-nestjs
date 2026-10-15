import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Delete,
  Param,
  Body,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ======================
  // CRUD (RESOURCE)
  // ======================

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Req() req: Request, @Query() query: any) {
    return this.usersService.findAll(req.user, query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() req: Request, @Body() dto: CreateUserDto) {
    return this.usersService.create(req.user, dto);
  }

  // Laravel compatibility
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updatePut(@Param('id') id: number, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }

  // ======================
  // ENDPOINTS LARAVEL
  // ======================

  // POST /users/create-user
  @Post('create-user')
  async createUser(@Body() body: any) {
    return this.usersService.createUser(body);
  }

  // POST /users/signup-costumer
  @Post('signup-costumer')
  async signUpCustomer(@Body() body: any) {
    return this.usersService.signUpCustomer(body);
  }

  // POST /users/complete-signup/:token
  @Post('complete-signup/:token')
  async completeSignUp(@Param('token') token: string, @Body() body: any) {
    return this.usersService.completeSignUp(token, body);
  }

  // GET /users/resend-signup-email/:id
  @UseGuards(JwtAuthGuard)
  @Get('resend-signup-email/:id')
  async resendSignUpEmail(@Param('id') id: number) {
    return this.usersService.resendSignUpEmail(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('set-property-fav/:propertyId/:fav')
  async setPropertyFav(
    @Req() req: Request,
    @Param('propertyId') propertyId: number,
    @Param('fav') fav: number,
  ) {
    const user = req.user as any;

    return this.usersService.setPropertyFav(
      user,
      Number(propertyId),
      Number(fav),
    );
  }
}
