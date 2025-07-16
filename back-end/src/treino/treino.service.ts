import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateTreinoDto } from './dto/create-treino.dto';
import { UpdateTreinoDto } from './dto/update-treino.dto';
import { Treino } from './entities/treino.entity';

@Injectable()
export class TreinoService {
  constructor(
    @InjectRepository(Treino)
    private readonly treinoRepository: Repository<Treino>,
  ) {}

  async create(createTreinoDto: CreateTreinoDto): Promise<Treino> {
    const treino = this.treinoRepository.create(createTreinoDto);
    return this.treinoRepository.save(treino);
  }

  async findAll(): Promise<Treino[]> {
    return this.treinoRepository.find();
  }

  async findOne(id: number): Promise<Treino> {
    const treino = await this.treinoRepository.findOne({ where: { id } });
    if (!treino) {
      throw new NotFoundException(`Treino com ID "${id}" não encontrado.`);
    }
    return treino;
  }

  async update(id: number, updateTreinoDto: UpdateTreinoDto): Promise<Treino> {
    const treino = await this.findOne(id);
    this.treinoRepository.merge(treino, updateTreinoDto);
    return this.treinoRepository.save(treino);
  }

  async remove(id: number): Promise<void> {
    const result = await this.treinoRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Treino com ID "${id}" não encontrado.`);
    }
  }

  async findByTitulo(titulo: string): Promise<Treino[]> {
    return this.treinoRepository.find({
      where: {
        titulo: Like(`%${titulo}%`),
      },
    });
  }
}