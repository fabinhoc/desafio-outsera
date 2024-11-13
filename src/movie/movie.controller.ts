import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { Movie } from './movies.entity';
import { CreateMovieDto } from './create-movies.dto';
import { UpdateMovieDto } from './update-movies.dto';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MoviesService) {}

  @Get('prize-range')
  prizeRange(): Promise<Movie[]> {
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

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateMovieDto: UpdateMovieDto,
  ): Promise<Movie> {
    return this.movieService.update(id, updateMovieDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.movieService.remove(id);
  }
}
