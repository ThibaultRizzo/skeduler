# Skeduler

An application aiming at generating randomized schedules matching given constraints

## Clone the repo

```sh
> git clone YOUR_REPO_URL
```

## Move to project folder

```sh
> cd skeduler
```

## Add .env file and custom (if needed)

```sh
>  cp backend/.env.dev backend/.env
```

## Start db

```sh
> docker-compose -f docker-compose.dev.yml up -d --build
```

## Init db

```sh
> source bin/db-create.sh
```

## Start server

At the source of your project:

```sh
> source bin/server-debug.sh
```

## Start client

At the source of your project and in another window:

```sh
> source bin/client-debug.sh
```

## Launch app in browser

Go to localhost:3000

## Additional commands

### Remove database and volume

```sh
> docker-compose -f docker-compose.dev.yml down -v
```

## Server setup

### Add dependencies

```sh
> source bin/server-setup.sh
```

### Add env file and certificates

```sh
> source bin/server-deploy-env.sh
```
