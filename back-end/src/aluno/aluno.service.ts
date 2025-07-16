import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateAlunoDto } from './dto/create-aluno.dto';
import { UpdateAlunoDto } from './dto/update-aluno.dto';
import { Aluno } from './entities/aluno.entity';

@Injectable()
export class AlunoService {
  constructor(
    @InjectRepository(Aluno)
    private readonly alunoRepository: Repository<Aluno>,
  ) {}

  async create(createAlunoDto: CreateAlunoDto): Promise<Aluno> {
    const aluno = this.alunoRepository.create(createAlunoDto);
    return this.alunoRepository.save(aluno);
  }

  async findAll(): Promise<Aluno[]> {
    return this.alunoRepository.find();
  }

  async findOne(id: number): Promise<Aluno> {
    const aluno = await this.alunoRepository.findOne({ where: { id } });
    if (!aluno) {
      throw new NotFoundException(`Aluno com ID "${id}" não encontrado.`);
    }
    return aluno;
  }

  async update(id: number, updateAlunoDto: UpdateAlunoDto): Promise<Aluno> {
    const aluno = await this.findOne(id);
    this.alunoRepository.merge(aluno, updateAlunoDto);
    return this.alunoRepository.save(aluno);
  }

  async remove(id: number): Promise<void> {
    const result = await this.alunoRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Aluno com ID "${id}" não encontrado.`);
    }
  }

  // Novo endpoint: Busca por nome
  async findByName(nome: string): Promise<Aluno[]> {
    return this.alunoRepository.find({
      where: {
        nome: Like(`%${nome}%`),
      },
    });
  }
}