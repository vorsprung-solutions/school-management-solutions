import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cockieParser from 'cookie-parser';
import notFound from './app/middleware/notFound';
import globalErrorHandler from './app/middleware/globalErrorHandlers';
import router from './app/routes/routes';

const app: Application = express();

// parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cockieParser());

app.use(cors({ origin: true, credentials: true }));

// application routes
app.use('/api', router)

// Test route
app.get('/', async (req: Request, res: Response) => {
  const message = 'School Management Server is running';
  res.send(message);
});

// global error handler
app.use(globalErrorHandler);

// not found route
app.use(notFound);

export default app;
