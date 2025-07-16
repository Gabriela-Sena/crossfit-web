import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { CreateMatriculaTreinoDto } from './dto/create-matricula-treino.dto';
import { UpdateMatriculaTreinoDto } from './dto/update-matricula-treino.dto';
import { MatriculaTreino } from './entities/matricula-treino.entity';
import { Aluno } from '../aluno/entities/aluno.entity';
import { Treino } from '../treino/entities/treino.entity';

@Injectable()
export class MatriculaTreinoService {
  constructor(
    @InjectRepository(MatriculaTreino)
    private readonly matriculaTreinoRepository: Repository<MatriculaTreino>,
    @InjectRepository(Aluno)
    private readonly alunoRepository: Repository<Aluno>,
    @InjectRepository(Treino)
    private readonly treinoRepository: Repository<Treino>,
  ) {}

  async create(createMatriculaTreinoDto: CreateMatriculaTreinoDto): Promise<MatriculaTreino> {
    const { alunoId, treinoId } = createMatriculaTreinoDto;

    const aluno = await this.alunoRepository.findOne({ where: { id: alunoId } });
    if (!aluno) {
      throw new NotFoundException(`Aluno com ID "${alunoId}" não encontrado.`);
    }

    const treino = await this.treinoRepository.findOne({ where: { id: treinoId } });
    if (!treino) {
      throw new NotFoundException(`Treino com ID "${treinoId}" não encontrado.`);
    }

    const existingMatricula = await this.matriculaTreinoRepository.findOne({
      where: { alunoId, treinoId },
    });
    if (existingMatricula) {
      throw new BadRequestException('Aluno já matriculado neste treino.');
    }

    const matriculasNoTreino = await this.matriculaTreinoRepository.count({
      where: { treinoId },
    });
    if (matriculasNoTreino >= treino.capacidadeMaxima) {
      throw new BadRequestException('Capacidade máxima do treino atingida.');
    }

    const matricula = this.matriculaTreinoRepository.create(createMatriculaTreinoDto);
    return this.matriculaTreinoRepository.save(matricula);
  }

  async findAll(alunoId?: number, treinoId?: number): Promise<MatriculaTreino[]> {
    const whereConditions: { alunoId?: number; treinoId?: number } = {};

    if (alunoId) {
      whereConditions.alunoId = alunoId;
    }
    if (treinoId) {
      whereConditions.treinoId = treinoId;
    }

    const options: FindManyOptions<MatriculaTreino> = {
      relations: ['aluno', 'treino'],
      where: whereConditions,
    };

    return this.matriculaTreinoRepository.find(options);
  }

  async findOne(id: number): Promise<MatriculaTreino> {
    const matricula = await this.matriculaTreinoRepository.findOne({
      where: { id },
      relations: ['aluno', 'treino'],
    });
    if (!matricula) {
      throw new NotFoundException(`Matrícula com ID "${id}" não encontrada.`);
    }
    return matricula;
  }

  async update(id: number, updateMatriculaTreinoDto: UpdateMatriculaTreinoDto): Promise<MatriculaTreino> {
    const matricula = await this.findOne(id);
    this.matriculaTreinoRepository.merge(matricula, updateMatriculaTreinoDto);
    return this.matriculaTreinoRepository.save(matricula);
  }

  async remove(id: number): Promise<void> {
    const result = await this.matriculaTreinoRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Matrícula com ID "${id}" não encontrada.`);
    }
  }
}