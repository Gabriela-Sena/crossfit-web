import { IsString, IsNotEmpty, IsDateString, IsOptional, IsInt, Min } from 'class-validator';

export class CreateTreinoDto {
  @IsNotEmpty()
  @IsString()
  titulo: string;

  @IsNotEmpty()
  @IsString()
  descricao: string;

  @IsDateString()
  data: string; 

  @IsString()
  @IsNotEmpty()
  horario: string;

  @IsInt()
  @Min(1)
  capacidadeMaxima: number;
}