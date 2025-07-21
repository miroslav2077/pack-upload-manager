# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Docker Compose Local Development

You can run the app and a local PostgreSQL database using Docker Compose:

```bash
docker-compose up --build
```

- The app will be available at http://localhost:5173
- The database will be available at localhost:5432 (user: postgres, password: postgres, db: pack_upload_manager)

To apply database migrations inside the running app container:

```bash
docker-compose exec app npx prisma migrate deploy
```

To stop and remove containers:

```bash
docker-compose down
```

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
