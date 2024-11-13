import { Test, TestingModule } from '@nestjs/testing';
import { MovieController } from './movie.controller';
import { MoviesService } from './movies.service';
import { Movie } from './movies.entity';
import { CreateMovieDto } from './create-movies.dto';
import { UpdateMovieDto } from './update-movies.dto';

describe('MovieController', () => {
  let controller: MovieController;
  let service: MoviesService;

  const mockMovie: Movie = {
    id: 1,
    title: 'Mock Movie',
    year: '2020',
    studio: 'Mock Studio',
    producer: 'Mock Producer',
    winner: 'yes',
  };

  const mockMoviesService = {
    findAll: jest.fn().mockResolvedValue([mockMovie]),
    findOne: jest.fn().mockResolvedValue(mockMovie),
    create: jest.fn().mockResolvedValue(mockMovie),
    update: jest.fn().mockResolvedValue(mockMovie),
    remove: jest.fn().mockResolvedValue({ affected: 1 }),
    prizeRange: jest.fn().mockResolvedValue([mockMovie]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovieController],
      providers: [
        {
          provide: MoviesService,
          useValue: mockMoviesService,
        },
      ],
    }).compile();

    controller = module.get<MovieController>(MovieController);
    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of movies', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([mockMovie]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single movie by id', async () => {
      const result = await controller.findOne(1);
      expect(result).toEqual(mockMovie);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create a new movie', async () => {
      const createMovieDto: CreateMovieDto = {
        title: 'New Movie',
        year: '2021',
        studio: 'New Studio',
        producer: 'New Producer',
        winner: 'no',
      };

      const result = await controller.create(createMovieDto);
      expect(result).toEqual(mockMovie);
      expect(service.create).toHaveBeenCalledWith(createMovieDto);
    });
  });

  describe('update', () => {
    it('should update an existing movie', async () => {
      const updateMovieDto: UpdateMovieDto = {
        title: 'Updated Movie',
      };

      const result = await controller.update(1, updateMovieDto);
      expect(result).toEqual(mockMovie);
      expect(service.update).toHaveBeenCalledWith(1, updateMovieDto);
    });
  });

  describe('remove', () => {
    it('should remove a movie by id', async () => {
      const result = await controller.remove(1);
      expect(result).toEqual({ affected: 1 });
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('prizeRange', () => {
    it('should return movies within the prize range', async () => {
      const result = await controller.prizeRange();
      expect(result).toEqual([mockMovie]);
      expect(service.prizeRange).toHaveBeenCalled();
    });
  });
});
