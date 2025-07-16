import { IsNotEmpty, IsInt } from 'class-validator';

export class CreateMatriculaTreinoDto {
  @IsNotEmpty()
  @IsInt()
  alunoId: number;

  @IsNotEmpty()
  @IsInt()
  treinoId: number;
}