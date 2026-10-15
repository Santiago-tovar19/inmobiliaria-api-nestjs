import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import { SeederService } from '../database.service';

@Injectable()
export class SeederCommand {
  constructor(private readonly seederService: SeederService) {}

  @Command({
    command: 'db:seed', // nombre del comando en la terminal
    describe: 'Seed the database with initial data',
  })
  async seed() {
    await this.seederService.seed();
  }
}
