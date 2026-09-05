import express from 'express';
import cors from 'cors';
import { dbErrorHandler, errorHandler } from './middleware/errorHandler.js';
import router from './routes/index.js';

const corsOptions = {
  origin: '*',
};
const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use('/api', router);
app.use(dbErrorHandler, errorHandler);
export default app;
