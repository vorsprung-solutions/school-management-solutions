import mongoose from 'mongoose';
import app from './app';
import config from './config';
import { initSuperAdmin } from './app/utils/initSuperAdmin';

let server: ReturnType<typeof app.listen> | undefined;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    await initSuperAdmin();
    app.listen(config.port, () => {
      console.log(`app listening on port ${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
}
main();

process.on('unhandledRejection', (err) => {
  console.log(`unhandledRejection is detected shutting down the server`);
  console.log('err', err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on('uncaughtException', () => {
  console.log(`uncaughtException is detected shutting down the server`);
  process.exit(1);
});
