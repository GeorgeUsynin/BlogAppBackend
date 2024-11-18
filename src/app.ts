import cors from 'cors';
import express, { Request, Response } from 'express';
import { HTTP_STATUS_CODES } from './constants';
import { ROUTES } from './constants';
import { BlogsRouter } from './features/blogs/router';
import { PostsRouter } from './features/posts/router';
import { TestRouter } from './features/tests/router';

export const app = express(); // create app

app.use(express.json()); // adding body parse middleware
app.use(cors()); // allow all clients to use our backend endpoints

app.use(ROUTES.TESTING, TestRouter);
app.use(ROUTES.BLOGS, BlogsRouter);
app.use(ROUTES.POSTS, PostsRouter);

app.get('/', (req: Request, res: Response) => {
    res.status(HTTP_STATUS_CODES.OK_200).json({ version: '1.0' });
});
