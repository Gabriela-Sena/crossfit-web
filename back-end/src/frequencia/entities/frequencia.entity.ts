import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, Unique } from 'typeorm';
import { Aluno } from '../../aluno/entities/aluno.entity';
import { Treino } from '../../treino/entities/treino.entity';

@Entity('frequencias')
@Unique(['alunoId', 'treinoId', 'dataPresenca'])
export class Frequencia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  alunoId: number;

  @Column()
  treinoId: number;

  @CreateDateColumn({ type: 'datetime' })
  dataPresenca: Date;

  @Column({ default: true })
  presente: boolean;

  @ManyToOne(() => Aluno, aluno => aluno.frequencias)
  @JoinColumn({ name: 'alunoId' })
  aluno: Aluno;

  @ManyToOne(() => Treino, treino => treino.frequencias)
  @JoinColumn({ name: 'treinoId' })
  treino: Treino;
}