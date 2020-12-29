# jwt-koa-app

## About

Simple application with JWT Authentication.

App routes:

- `/` - just outputs "Ok" for testing app
- `/auth/login` - user authentication
- `/auth/register` - user registration
- `/auth/refresh` - update refreshToken
- `/auth/logout` - user logout
- `/users` - list all registered user
- `/users/:guid` - find user by guid

## Dependencies

All dependencies can be viewed in the file `package.json`.The application is based on the framework `Koa`.
Data storage in `MongoDB` and `Mongoose` ODM. For run app and run tests locally, used `mongodb-memory-server` module, by default it holds the data in memory. Also it's used to run in Docker container.
`Jest` framework was used for testing.

## Running Application

#### For run app locally

Install all dependencies

```bash
yarn install
```

Run project locally

```bash
yarn start
```

Run test locally

```bash
yarn test
```

#### For run app in docker

Build app in container

```bash
docker-compose build
```

Run build app

```bash
docker-compose up
```
