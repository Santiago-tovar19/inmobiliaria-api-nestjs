import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { Role } from 'src/roles/entities/role.entities';
import { Broker } from 'src/brokers/entities/broker.entity';
import { FavUserProperty } from './entities/fav-user-property.entity';
import { Property } from 'src/properties/entities/property.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Broker, FavUserProperty, Property]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
