// src/matricula-treino/entities/matricula-treino.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Aluno } from '../../aluno/entities/aluno.entity';
import { Treino } from '../../treino/entities/treino.entity';

@Entity('matriculas_treino')
export class MatriculaTreino {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  alunoId: number;

  @Column()
  treinoId: number;

  @CreateDateColumn() 
  dataMatricula: Date;

  @ManyToOne(() => Aluno, aluno => aluno.matriculasTreino)
  @JoinColumn({ name: 'alunoId' })
  aluno: Aluno;

  @ManyToOne(() => Treino, treino => treino.matriculasTreino)
  @JoinColumn({ name: 'treinoId' })
  treino: Treino;
}