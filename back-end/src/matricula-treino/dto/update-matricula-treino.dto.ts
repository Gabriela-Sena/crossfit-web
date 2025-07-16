import { PartialType } from '@nestjs/mapped-types';
import { CreateMatriculaTreinoDto } from './create-matricula-treino.dto';

export class UpdateMatriculaTreinoDto extends PartialType(CreateMatriculaTreinoDto) {}