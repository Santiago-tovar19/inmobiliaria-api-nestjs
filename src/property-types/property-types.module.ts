import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyType } from './entities/property-type.entity/property-type.entity';
import { PropertyTypeService } from './property-types.service';
import { PropertyTypeController } from './property-types.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PropertyType])],
  controllers: [PropertyTypeController],
  providers: [PropertyTypeService],
  exports: [TypeOrmModule, PropertyTypeService], // ✅ exportar para otros módulos
})
export class PropertyTypesModule {}
