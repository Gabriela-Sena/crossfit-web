import { Module } from '@nestjs/common';
import { TreinoService } from './treino.service';
import { TreinoController } from './treino.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Treino } from './entities/treino.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Treino])],
  controllers: [TreinoController],
  providers: [TreinoService],
})
export class TreinoModule {}
