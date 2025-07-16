
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { MatriculaTreino } from 'src/matricula-treino/entities/matricula-treino.entity';
import { Frequencia } from 'src/frequencia/entities/frequencia.entity';

@Entity('alunos') 
export class Aluno {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nome: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'date' })
  dataNascimento: Date;

  @Column({ length: 20, nullable: true })
  telefone: string;

  @Column({ default: true })
  ativo: boolean;

  @OneToMany(() => MatriculaTreino, matriculaTreino => matriculaTreino.aluno)
  matriculasTreino: MatriculaTreino[];

  @OneToMany(() => Frequencia, frequencia => frequencia.aluno)
  frequencias: Frequencia[];
}