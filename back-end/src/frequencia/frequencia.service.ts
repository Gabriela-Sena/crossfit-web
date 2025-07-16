import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { CreateFrequenciaDto } from './dto/create-frequencia.dto';
import { UpdateFrequenciaDto } from './dto/update-frequencia.dto';
import { Frequencia } from './entities/frequencia.entity';
import { Aluno } from '../aluno/entities/aluno.entity';
import { Treino } from '../treino/entities/treino.entity';

@Injectable()
export class FrequenciaService {
  constructor(
    @InjectRepository(Frequencia)
    private readonly frequenciaRepository: Repository<Frequencia>,
    @InjectRepository(Aluno)
    private readonly alunoRepository: Repository<Aluno>,
    @InjectRepository(Treino)
    private readonly treinoRepository: Repository<Treino>,
  ) {}

  async create(createFrequenciaDto: CreateFrequenciaDto): Promise<Frequencia> {
    const { alunoId, treinoId, dataPresenca } = createFrequenciaDto;

    const aluno = await this.alunoRepository.findOne({ where: { id: alunoId } });
    if (!aluno) {
      throw new NotFoundException(`Aluno com ID "${alunoId}" não encontrado.`);
    }

    const treino = await this.treinoRepository.findOne({ where: { id: treinoId } });
    if (!treino) {
      throw new NotFoundException(`Treino com ID "${treinoId}" não encontrado.`);
    }

    const existingFrequencia = await this.frequenciaRepository.findOne({
      where: {
        alunoId,
        treinoId,
        dataPresenca: dataPresenca ? new Date(dataPresenca) : new Date(),
      },
    });

    if (existingFrequencia) {
      throw new BadRequestException('Frequência para este aluno neste treino nesta data já registrada.');
    }

    const frequencia = this.frequenciaRepository.create({
      ...createFrequenciaDto,
      dataPresenca: dataPresenca ? new Date(dataPresenca) : new Date(),
    });
    return this.frequenciaRepository.save(frequencia);
  }

  async findAll(alunoId?: number, treinoId?: number): Promise<Frequencia[]> {
    const whereConditions: { alunoId?: number; treinoId?: number } = {};

    if (alunoId) {
      whereConditions.alunoId = alunoId;
    }
    if (treinoId) {
      whereConditions.treinoId = treinoId;
    }

    const options: FindManyOptions<Frequencia> = {
      relations: ['aluno', 'treino'],
      where: whereConditions,
    };

    return this.frequenciaRepository.find(options);
  }

  async findOne(id: number): Promise<Frequencia> {
    const frequencia = await this.frequenciaRepository.findOne({
      where: { id },
      relations: ['aluno', 'treino'],
    });
    if (!frequencia) {
      throw new NotFoundException(`Frequência com ID "${id}" não encontrada.`);
    }
    return frequencia;
  }

  async update(id: number, updateFrequenciaDto: UpdateFrequenciaDto): Promise<Frequencia> {
    const frequencia = await this.findOne(id);
    this.frequenciaRepository.merge(frequencia, updateFrequenciaDto);
    return this.frequenciaRepository.save(frequencia);
  }

  async remove(id: number): Promise<void> {
    const result = await this.frequenciaRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Frequência com ID "${id}" não encontrada.`);
    }
  }

  async findByDate(dateString: string): Promise<Frequencia[]> {
    return this.frequenciaRepository.find({
      where: {
        dataPresenca: new Date(dateString),
      },
      relations: ['aluno', 'treino'],
    });
  }
}