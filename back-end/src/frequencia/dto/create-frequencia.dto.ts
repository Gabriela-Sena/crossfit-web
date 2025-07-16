import { IsNotEmpty, IsInt, IsBoolean, IsOptional, IsDateString } from 'class-validator';

export class CreateFrequenciaDto {
  @IsNotEmpty()
  @IsInt()
  alunoId: number;

  @IsNotEmpty()
  @IsInt()
  treinoId: number;

  @IsOptional()
  @IsDateString()
  dataPresenca?: string;

  @IsOptional()
  @IsBoolean()
  presente?: boolean;
}