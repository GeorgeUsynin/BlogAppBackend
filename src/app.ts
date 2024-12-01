import cors from 'cors';
import express, { Request, Response } from 'express';
import { HTTP_STATUS_CODES, ROUTES } from './constants';
import { BlogsRouter } from './features/blogs/router';
import { PostsRouter } from './features/posts/router';
import { TestRouter } from './features/tests/router';
import { UsersRouter } from './features/users/router';
import { databaseConnectionMiddleware } from './middlewares';

export const app = express(); // create app

// Middleware for database connection to proper handle Vercel deployment
process.env.VERCEL === '1' && app.use(databaseConnectionMiddleware);

app.use(express.json()); // adding body parse middleware
app.use(cors()); // allow all clients to use our backend endpoints

app.use(ROUTES.TESTING, TestRouter);
app.use(ROUTES.BLOGS, BlogsRouter);
app.use(ROUTES.POSTS, PostsRouter);
app.use(ROUTES.USERS, UsersRouter);

app.get('/', (req: Request, res: Response) => {
    res.status(HTTP_STATUS_CODES.OK_200).json({ version: '1.0' });
});
