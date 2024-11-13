import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty()
  year: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  studio: string;

  @IsString()
  @IsNotEmpty()
  producer: string;

  @IsString()
  @IsOptional()
  winner: string | null;
}
