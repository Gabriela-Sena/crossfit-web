
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { MatriculaTreino } from 'src/matricula-treino/entities/matricula-treino.entity';
import { Frequencia } from 'src/frequencia/entities/frequencia.entity';

@Entity('treinos')
export class Treino {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  titulo: string;

  @Column({ type: 'text' })
  descricao: string;

  @Column({ type: 'date' })
  data: Date;

  @Column({ type: 'time' })
  horario: string;

  @Column()
  capacidadeMaxima: number;

  @OneToMany(() => MatriculaTreino, matriculaTreino => matriculaTreino.treino)
  matriculasTreino: MatriculaTreino[];

  @OneToMany(() => Frequencia, frequencia => frequencia.treino)
  frequencias: Frequencia[];
}