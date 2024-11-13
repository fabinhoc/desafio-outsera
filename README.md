<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">Desafio Outsera</p>

## Descrição

#### Desenvolva uma API RESTful para possibilitar a leitura da lista de indicados e vencedores da categoria Pior Filme do Golden Raspberry Awards.

A aplicação por padrão ao inicializar irá popular dados vindo do arquivo csv contido na pasta `src/data/movies.csv`

A rota GET http://localhost:3000/movies/prize-range é o resultado esperado do desafio.

## Tecnologias e pacotes utilizados no projeto

- Nestjs
- Sqlite 3
- csv-parser
- typeorm
- eslint
- prettier
- jest

## Instalação

```bash
$ git clone git@github.com:fabinhoc/desafio-outsera.git
$ cd desafio-outsera
$ docker compose up

```

Acessar `http://localhost:3000`

## Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Run tests

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## endpoints

```
GET http://localhost:3000/movies
POST http://localhost:3000/movies
GET http://localhost:3000/movies/:id
PUT http://localhost:3000/movies/:id
DELETE http://localhost:3000/movies/:id

# ROTA COM O RESULTADO ESPERADO PELO DESAFIO
GET http://localhost:3000/movies/prize-range

```

# Utilize o Insomnia

Faça a importação no insomnia do arquivo [movies-endpoint.json](https://github.com/fabinhoc/desafio-outsera/blob/main/movies-endpoints.json)

# e2e tests

$ yarn run test:e2e

# test coverage

$ yarn run test:cov

```

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
```
