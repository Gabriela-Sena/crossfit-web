import { Module } from '@nestjs/common';
import { FrequenciaService } from './frequencia.service';
import { FrequenciaController } from './frequencia.controller';
import { Frequencia } from './entities/frequencia.entity';
import { Aluno } from '../aluno/entities/aluno.entity';
import { Treino } from '../treino/entities/treino.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Frequencia, Aluno, Treino])
  ],
  controllers: [FrequenciaController],
  providers: [FrequenciaService],
})
export class FrequenciaModule {}
