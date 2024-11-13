import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Movie } from '../src/movie/movies.entity';
import { Repository } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('MoviesController (e2e)', () => {
  let app: INestApplication;
  let movieRepository: Repository<Movie>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          synchronize: true,
          dropSchema: true,
          entities: [Movie],
          logging: false,
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    movieRepository = moduleFixture.get<Repository<Movie>>(
      getRepositoryToken(Movie),
    );
  });

  afterAll(async () => {
    if (app) {
      console.log('Closing the application...');
      await app.close();
    } else {
      console.log('App is undefined. Cannot close the application.');
    }
  });

  afterEach(async () => {
    await movieRepository.delete({});
  });

  it('/movies (POST) - create a movie', async () => {
    const response = await request(app.getHttpServer())
      .post('/movies')
      .send({
        title: 'New Movie',
        year: '2024',
        studio: 'Studio A',
        producer: 'Producer A',
      })
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        title: 'New Movie',
        year: '2024',
      }),
    );
  });

  it('/movies (GET) - Return all movies', async () => {
    await movieRepository.save([
      {
        title: 'Movie 1',
        year: '2022',
        studio: 'Studio B',
        producer: 'Producer B',
      },
      {
        title: 'Movie 2',
        year: '2023',
        studio: 'Studio C',
        producer: 'Producer C',
      },
    ]);

    const response = await request(app.getHttpServer())
      .get('/movies')
      .expect(200);
    expect(response.body.length).toBe(2);
  }, 10000);

  it('/movies/:id (GET) - get movie by id', async () => {
    const movie = await movieRepository.save({
      title: 'Specific Movie',
      year: '2023',
      studio: 'Studio D',
      producer: 'Producer D',
    });

    const response = await request(app.getHttpServer())
      .get(`/movies/${movie.id}`)
      .expect(200);
    expect(response.body).toEqual(
      expect.objectContaining({ id: movie.id, title: 'Specific Movie' }),
    );
  });

  it('/movies/:id (PUT) - update a movie', async () => {
    const movie = await movieRepository.save({
      title: 'Old Title',
      year: '2022',
      studio: 'Studio E',
      producer: 'Producer E',
    });

    const response = await request(app.getHttpServer())
      .put(`/movies/${movie.id}`)
      .send({ title: 'Updated Title' })
      .expect(200);

    expect(response.body.title).toBe('Updated Title');
  });

  it('/movies/prize-range (GET) - Show Prize range', async () => {
    await movieRepository.save([
      {
        title: 'Movie 1',
        year: '2008',
        studio: 'Studio 1',
        producer: 'Producer 1',
      },
      {
        title: 'Movie 1',
        year: '2009',
        studio: 'Studio 1',
        producer: 'Producer 1',
      },
      {
        title: 'Movie 2',
        year: '2018',
        studio: 'Studio 2',
        producer: 'Producer 2',
      },
      {
        title: 'Movie 2',
        year: '2019',
        studio: 'Studio 2',
        producer: 'Producer 2',
      },
      {
        title: 'Movie 3',
        year: '1900',
        studio: 'Studio 3',
        producer: 'Producer 1',
      },
      {
        title: 'Movie 3',
        year: '1999',
        studio: 'Studio 3',
        producer: 'Producer 1',
      },
      {
        title: 'Movie 4',
        year: '2000',
        studio: 'Studio 3',
        producer: 'Producer 2',
      },
      {
        title: 'Movie 4',
        year: '2099',
        studio: 'Studio 3',
        producer: 'Producer 2',
      },
    ]);

    const expectedValue = {
      min: [
        {
          producer: 'Producer 1',
          interval: 1,
          previousWin: 2008,
          followingWin: 2009,
        },
        {
          producer: 'Producer 2',
          interval: 1,
          previousWin: 2018,
          followingWin: 2019,
        },
      ],
      max: [
        {
          producer: 'Producer 1',
          interval: 99,
          previousWin: 1900,
          followingWin: 1999,
        },
        {
          producer: 'Producer 2',
          interval: 80,
          previousWin: 2019,
          followingWin: 2099,
        },
      ],
    };

    const response = await request(app.getHttpServer())
      .get(`/movies/prize-range`)
      .expect(200);

    expect(response.body).toStrictEqual(expectedValue);
  });

  it('/movies/:id (DELETE) - delete movie', async () => {
    const movie = await movieRepository.save({
      title: 'To be deleted',
      year: '2023',
      studio: 'Studio F',
      producer: 'Producer F',
    });

    await request(app.getHttpServer())
      .delete(`/movies/${movie.id}`)
      .expect(200);

    const deletedMovie = await movieRepository.findOne({
      where: { id: movie.id },
    });
    expect(deletedMovie).toBeNull();
  });
});
