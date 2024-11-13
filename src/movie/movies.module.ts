import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './movies.entity';
import { MoviesService } from './movies.service';
import { MovieController } from './movie.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Movie])],
  providers: [MoviesService],
  controllers: [MovieController],
  exports: [MoviesService, TypeOrmModule],
})
export class MoviesModule {}
