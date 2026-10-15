import { Module } from '@nestjs/common';
import { SeederModule } from './seeders/seeder.module';

@Module({
  imports: [SeederModule],
})
export class DatabaseModule {}
