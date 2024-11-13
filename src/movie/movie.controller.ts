import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { Movie } from './movies.entity';
import { CreateMovieDto } from './create-movies.dto';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MoviesService) {}

  @Get('prize-range')
  prizeRange(): Promise<Movie[]> {
    console.log('Acessando a rota prize-range...');
    return this.movieService.prizeRange();
  }

  @Get()
  findAll(): Promise<Movie[]> {
    return this.movieService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Movie> {
    return this.movieService.findOne(id);
  }

  @Post()
  create(@Body() createMovieDto: CreateMovieDto): Promise<Movie> {
    return this.movieService.create(createMovieDto);
  }
}
