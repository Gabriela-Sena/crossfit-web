import { Module } from '@nestjs/common';
import { MatriculaTreinoService } from './matricula-treino.service';
import { MatriculaTreinoController } from './matricula-treino.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatriculaTreino } from './entities/matricula-treino.entity';
import { Aluno } from 'src/aluno/entities/aluno.entity';
import { Treino } from 'src/treino/entities/treino.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MatriculaTreino, Aluno, Treino])
  ],
  controllers: [MatriculaTreinoController],
  providers: [MatriculaTreinoService],
})
export class MatriculaTreinoModule {}
