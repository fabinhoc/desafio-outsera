import { IsOptional, IsString } from 'class-validator';

export class UpdateMovieDto {
  @IsString()
  @IsOptional()
  year?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  studio?: string;

  @IsString()
  @IsOptional()
  producer?: string;

  @IsString()
  @IsOptional()
  winner?: string | null;
}
