import { MoviesService } from './movies.service';
import { Movie } from './movies.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateMovieDto } from './create-movies.dto';

describe('MoviesService', () => {
  let service: MoviesService;

  const mockMovieRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: getRepositoryToken(Movie),
          useValue: mockMovieRepository,
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return an array of movies', async () => {
    const moviesArray = [
      { id: 1, title: 'Movie 1', year: '2022', producer: 'Producer 1' },
    ];
    mockMovieRepository.find.mockResolvedValue(moviesArray);

    const result = await service.findAll();
    expect(result).toEqual(moviesArray);
    expect(mockMovieRepository.find).toHaveBeenCalledWith({
      order: { year: 'ASC' },
    });
  });

  it('should return a single movie by id', async () => {
    const movie = {
      id: 1,
      title: 'Movie 1',
      year: '2022',
      producer: 'Producer 1',
    };
    mockMovieRepository.findOneBy.mockResolvedValue(movie);

    const result = await service.findOne(1);
    expect(result).toEqual(movie);
    expect(mockMovieRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });

  it('should return null if movie not found', async () => {
    mockMovieRepository.findOneBy.mockResolvedValue(null);

    const result = await service.findOne(999);
    expect(result).toBeNull();
  });

  it('should update a movie and return it', async () => {
    const updateMovieDto = {
      title: 'Updated Movie',
      year: '2024',
      producer: 'Producer 1',
    };
    const updatedMovie = { id: 1, ...updateMovieDto };

    mockMovieRepository.update.mockResolvedValue({ affected: 1 });
    mockMovieRepository.findOne.mockResolvedValue(updatedMovie);

    const result = await service.update(1, updateMovieDto);
    expect(result).toEqual(updatedMovie);
    expect(mockMovieRepository.update).toHaveBeenCalledWith(1, updateMovieDto);
    expect(mockMovieRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('should return undefined if movie not found when updating', async () => {
    mockMovieRepository.update.mockClear();
    mockMovieRepository.findOne.mockResolvedValue(undefined);
    mockMovieRepository.update.mockResolvedValue({ affected: 0 });

    const result = await service.update(999, { title: 'Updated Movie' });
    console.log(result);
    expect(result).toBeUndefined();
  });

  it('should calculate the prize range', async () => {
    const movies = [
      { id: 1, producer: 'Producer A', year: '2000' },
      { id: 2, producer: 'Producer A', year: '2001' },
      { id: 3, producer: 'Producer B', year: '2005' },
      { id: 4, producer: 'Producer B', year: '2010' },
    ];

    mockMovieRepository.find.mockResolvedValue(movies);

    const result = await service.prizeRange();
    expect(result).toEqual({
      min: [
        {
          producer: 'Producer A',
          interval: 1,
          previousWin: 2000,
          followingWin: 2001,
        },
      ],
      max: [
        {
          producer: 'Producer B',
          interval: 5,
          previousWin: 2005,
          followingWin: 2010,
        },
      ],
    });
  });

  it('should delete a movie by id', async () => {
    mockMovieRepository.delete.mockResolvedValue({ affected: 1 });

    const result = await service.remove(1);
    expect(result).toEqual({ affected: 1 });
    expect(mockMovieRepository.delete).toHaveBeenCalledWith(1);
  });

  it('should return null if movie not found when deleting', async () => {
    mockMovieRepository.delete.mockResolvedValue({ affected: 0 });

    const result = await service.remove(999);
    expect(result).toEqual({ affected: 0 });
  });

  describe('create', () => {
    it('should create and save a new movie', async () => {
      const payload: CreateMovieDto = {
        title: 'New Movie',
        year: '2024',
        studio: 'Studio A',
        producer: 'Producer A',
        winner: 'yes',
      };
      const savedMovie = { id: 1, ...payload };

      (mockMovieRepository.create as jest.Mock).mockReturnValue(savedMovie);
      (mockMovieRepository.save as jest.Mock).mockResolvedValue(savedMovie);

      const result = await service.create(payload);

      expect(mockMovieRepository.create).toHaveBeenCalledWith(payload);
      expect(mockMovieRepository.save).toHaveBeenCalledWith(savedMovie);
      expect(result).toEqual(savedMovie);
    });
  });

  describe('createMany', () => {
    it('should create and save multiple movies', async () => {
      const payload: Partial<CreateMovieDto[]> = [
        {
          title: 'Movie One',
          year: '2023',
          studio: 'Studio B',
          producer: 'Producer B',
          winner: 'no',
        },
        {
          title: 'Movie Two',
          year: '2024',
          studio: 'Studio C',
          producer: 'Producer C',
          winner: 'yes',
        },
      ];
      const savedMovies = payload.map((movie, index) => ({
        id: index + 1,
        ...movie,
      }));

      (mockMovieRepository.create as jest.Mock).mockReturnValue(savedMovies);
      (mockMovieRepository.save as jest.Mock).mockResolvedValue(savedMovies);

      const result = await service.createMany(payload);

      expect(mockMovieRepository.create).toHaveBeenCalledWith(payload);
      expect(mockMovieRepository.save).toHaveBeenCalledWith(savedMovies);
      expect(result).toEqual(savedMovies);
    });
  });
});
