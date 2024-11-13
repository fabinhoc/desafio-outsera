import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './movies.entity';
import { Repository } from 'typeorm';
import { CreateMovieDto } from './create-movies.dto';
import { UpdateMovieDto } from './update-movies.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  findAll(): Promise<Movie[]> {
    return this.movieRepository.find({
      order: {
        year: 'ASC',
      },
    });
  }

  findOne(id: number): Promise<Movie | null> {
    return this.movieRepository.findOneBy({ id });
  }

  createMany(payload: Partial<CreateMovieDto[]>): Promise<Movie[]> {
    const movies = this.movieRepository.create(payload);
    return this.movieRepository.save(movies);
  }

  create(payload: CreateMovieDto): Promise<Movie> {
    const movie = this.movieRepository.create(payload);
    return this.movieRepository.save(movie);
  }

  async update(id: number, payload: UpdateMovieDto): Promise<Movie> {
    await this.movieRepository.update(id, payload);
    return await this.movieRepository.findOne({
      where: { id },
    });
  }

  async prizeRange(): Promise<any> {
    const movies = await this.movieRepository.find({
      order: {
        producer: 'ASC',
        year: 'ASC',
      },
    });

    const result = {
      min: [],
      max: [],
    };

    const producers = new Map<string, Movie[]>();

    // agrupa os filmes por produtor
    for (const movie of movies) {
      if (!producers.has(movie.producer)) {
        producers.set(movie.producer, []);
      }
      producers.get(movie.producer)?.push(movie);
    }

    producers.forEach((moviesByProducer, producer) => {
      for (let i = 1; i < moviesByProducer.length; i++) {
        const currentMovie = moviesByProducer[i];
        const prevMovie = moviesByProducer[i - 1];
        const interval = parseInt(currentMovie.year) - parseInt(prevMovie.year);

        const resultEntry = {
          producer,
          interval,
          previousWin: parseInt(prevMovie.year),
          followingWin: parseInt(currentMovie.year),
        };

        if (interval === 1) {
          result.min.push(resultEntry);
        }

        if (interval > 1) {
          result.max.push(resultEntry);
        }
      }
    });

    result.min.sort((a, b) => a.interval - b.interval);
    result.max.sort((a, b) => b.interval - a.interval);

    return {
      min: result.min.slice(0, 2),
      max: result.max.slice(0, 1),
    };
  }

  remove(id: number) {
    return this.movieRepository.delete(id);
  }
}
