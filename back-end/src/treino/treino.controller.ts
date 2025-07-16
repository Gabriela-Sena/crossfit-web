import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpStatus, HttpCode } from '@nestjs/common';
import { TreinoService } from './treino.service';
import { CreateTreinoDto } from './dto/create-treino.dto';
import { UpdateTreinoDto } from './dto/update-treino.dto';
import { Treino } from './entities/treino.entity';

@Controller('treinos')
export class TreinoController {
  constructor(private readonly treinoService: TreinoService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTreinoDto: CreateTreinoDto): Promise<Treino> {
    return this.treinoService.create(createTreinoDto);
  }

  @Get()
  findAll(@Query('titulo') titulo?: string): Promise<Treino[]> {
    if (titulo) {
      return this.treinoService.findByTitulo(titulo);
    }
    return this.treinoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Treino> {
    return this.treinoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTreinoDto: UpdateTreinoDto): Promise<Treino> {
    return this.treinoService.update(+id, updateTreinoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.treinoService.remove(+id);
  }
}