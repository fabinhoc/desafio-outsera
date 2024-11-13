import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as csv from 'csv-parser';
import { MoviesService } from './movie/movies.service';
import { CreateMovieDto } from './movie/create-movies.dto';

@Injectable()
export class AppService {
  constructor(private moviesService: MoviesService) {}

  getHello(): string {
    return 'Hello World!';
  }
  loadDataFromCsv(): Promise<void> {
    const movies: Partial<CreateMovieDto[]> = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream('./src/data/movies.csv')
        .pipe(
          csv({
            separator: ';',
          }),
        )
        .on('data', (row) => {
          const movie: CreateMovieDto = {
            title: row.title,
            year: row.year,
            studio: row.studios,
            producer: row.producers,
            winner: row.winner,
          };
          movies.push(movie);
        })
        .on('end', async () => {
          await this.moviesService.createMany(movies);
        })
        .on('error', (error) => {
          console.error('Error reading CSV file', error);
          reject(error);
        });
    });
  }
}
