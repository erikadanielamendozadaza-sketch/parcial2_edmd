import { Module } from '@nestjs/common';
import { ProgramasService } from './programas.service';
import { ProgramasController } from './programas.controller';
import { Programa } from './entities/programa.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Programa])],
  controllers: [ProgramasController],
  providers: [ProgramasService],
})
export class ProgramasModule {}
