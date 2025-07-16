import { IsBoolean, IsDateString, IsEmail, IsOptional, IsString } from "class-validator";

export class CreateAlunoDto {
  @IsString()
  nome: string;

  @IsEmail()
  email: string;

  @IsDateString()
  dataNascimento: string;

  @IsOptional()
  @IsString()
  telefone?: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}