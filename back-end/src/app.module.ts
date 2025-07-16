import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlunoModule } from './aluno/aluno.module';
import { TreinoModule } from './treino/treino.module';
import { MatriculaTreinoModule } from './matricula-treino/matricula-treino.module';
import { FrequenciaModule } from './frequencia/frequencia.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite', 
      database: 'crossfit.sqlite', 
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, 
    }),
    AlunoModule,
    TreinoModule,
    MatriculaTreinoModule,
    FrequenciaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
