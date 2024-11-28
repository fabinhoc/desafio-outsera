import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';

describe('MoviesController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/movies/prize-range (GET) - Show Prize range', async () => {
    const expectedValue = {
      min: [
        {
          producer: 'Joel Silver',
          interval: 1,
          previousWin: 1990,
          followingWin: 1991,
        },
      ],
      max: [
        {
          interval: 13,
          producer: 'Matthew Vaughn',
          previousWin: 2002,
          followingWin: 2015,
        },
      ],
    };
    const response = await fetch('http://localhost:3000/movies/prize-range');
    const responseBody = await response.json();

    expect(responseBody).toEqual(expectedValue);
  });
});
