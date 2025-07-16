import { Controller, Get, Post, Body, Param, Delete, Query, HttpStatus, HttpCode, Patch } from '@nestjs/common';
import { MatriculaTreinoService } from './matricula-treino.service';
import { CreateMatriculaTreinoDto } from './dto/create-matricula-treino.dto';
import { UpdateMatriculaTreinoDto } from './dto/update-matricula-treino.dto';
import { MatriculaTreino } from './entities/matricula-treino.entity';

@Controller('matriculas-treino')
export class MatriculaTreinoController {
  constructor(private readonly matriculaTreinoService: MatriculaTreinoService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createMatriculaTreinoDto: CreateMatriculaTreinoDto): Promise<MatriculaTreino> {
    return this.matriculaTreinoService.create(createMatriculaTreinoDto);
  }

  @Get()
  findAll(
    @Query('alunoId') alunoId?: string,
    @Query('treinoId') treinoId?: string,
  ): Promise<MatriculaTreino[]> {
    return this.matriculaTreinoService.findAll(
      alunoId ? +alunoId : undefined,
      treinoId ? +treinoId : undefined
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<MatriculaTreino> {
    return this.matriculaTreinoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMatriculaTreinoDto: UpdateMatriculaTreinoDto): Promise<MatriculaTreino> {
    return this.matriculaTreinoService.update(+id, updateMatriculaTreinoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.matriculaTreinoService.remove(+id);
  }
}