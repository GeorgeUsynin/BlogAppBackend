import cors from 'cors';
import express, { Request, Response } from 'express';
import { HTTP_STATUS_CODES } from './constants';
import { ROUTES } from './constants';
import { BlogsRouter, TestRouter } from './routers';

export const app = express(); // create appP

app.use(express.json()); // adding body parse middleware
app.use(cors()); // allow all clients to use our backend endpoints

app.use(ROUTES.TESTING, TestRouter);
app.use(ROUTES.BLOGS, BlogsRouter);

app.get('/', (req: Request, res: Response) => {
    res.status(HTTP_STATUS_CODES.OK_200).json({ version: '1.0' });
});
