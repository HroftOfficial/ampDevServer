import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
// eslint-disable-next-line import/no-extraneous-dependencies
import cookieParser from 'cookie-parser';
import path from 'path';
import { errorMiddleware } from './middleware/error-middleware';
import { router } from './router';
import * as middlewares from './middlewares';
import { config } from './config/config';
// import api from './api';
// import MessageResponse from './interfaces/MessageResponse';

// require('dotenv').config();

const app = express();

app.use(morgan('dev'));
// app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(express.json());
app.use(cookieParser());

const whitelist = config?.CORS_DOMAINS?.split(',').map((item) => item.trim());
// console.log(whitelist);

app.use(
  cors({
    exposedHeaders: [
      'x-total-count',
      'x-total-partners',
      'x-total-news',
      'x-total-draft',
      'x-total-draft-filter',
      'x-total-plant',
      'x-total-draft-filter, x-total, x-total-partners',
    ],
    origin: function (origin, callback) {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error(' Not allowed by CORS '));
      }
    },
    credentials: true,
  }),
);

// Static folder
app.use(express.static(path.join(__dirname, 'public')));
// app.use(errorMiddleware);

app.get('/', (req, res) => {
  res.status(200).json({
    message: ' server is running ',
  });
});
app.use('/api', router);

// app.use('/api/v1', api);

app.use(middlewares.notFound);
// app.use(middlewares.errorHandler);
app.use(errorMiddleware);

export default app;
