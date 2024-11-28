import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesModule } from './movie/movies.module';
import { MoviesService } from './movie/movies.service';
import { MovieController } from './movie/movie.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      synchronize: true,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      dropSchema: false,
    }),
    MoviesModule,
  ],
  controllers: [AppController, MovieController],
  providers: [AppService, MoviesService],
})
export class AppModule {}
