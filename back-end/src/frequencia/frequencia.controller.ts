import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpStatus, HttpCode } from '@nestjs/common';
import { FrequenciaService } from './frequencia.service';
import { CreateFrequenciaDto } from './dto/create-frequencia.dto';
import { UpdateFrequenciaDto } from './dto/update-frequencia.dto';
import { Frequencia } from './entities/frequencia.entity';

@Controller('frequencias')
export class FrequenciaController {
  constructor(private readonly frequenciaService: FrequenciaService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createFrequenciaDto: CreateFrequenciaDto): Promise<Frequencia> {
    return this.frequenciaService.create(createFrequenciaDto);
  }

  @Get()
  findAll(
    @Query('alunoId') alunoId?: string,
    @Query('treinoId') treinoId?: string,
    @Query('data') data?: string,
  ): Promise<Frequencia[]> {
    if (data) {
      return this.frequenciaService.findByDate(data);
    }
    return this.frequenciaService.findAll(
      alunoId ? +alunoId : undefined,
      treinoId ? +treinoId : undefined
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Frequencia> {
    return this.frequenciaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFrequenciaDto: UpdateFrequenciaDto): Promise<Frequencia> {
    return this.frequenciaService.update(+id, updateFrequenciaDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.frequenciaService.remove(+id);
  }
}