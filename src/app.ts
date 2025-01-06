import cors from 'cors';
import cookieParser from 'cookie-parser';
import express, { Request, Response } from 'express';
import { HTTP_STATUS_CODES, ROUTES } from './constants';
import { AuthRouter } from './features/auth/router';
import { UsersRouter } from './features/users/router';
import { BlogsRouter } from './features/blogs/api';
import { PostsRouter } from './features/posts/router';
import { CommentsRouter } from './features/comments/router';
import { SecurityRouter } from './features/security/router';
import { TestRouter } from './features/tests/router';
import { APIErrorMiddleware } from './features/shared/api/APIMiddlewares';
import { databaseConnectionMiddleware } from './database/databaseConnectionMiddleware';

export const app = express(); // create app

// Middleware for database connection to proper handle Vercel deployment
process.env.VERCEL === '1' && app.use(databaseConnectionMiddleware);

app.use(cookieParser());
app.use(express.json()); // adding body parse middleware
app.use(cors()); // allow all clients to use our backend endpoints
app.set('trust proxy', true); // allows to get correct IP address from req.ip

app.use(ROUTES.AUTH, AuthRouter);
app.use(ROUTES.SECURITY, SecurityRouter);
app.use(ROUTES.USERS, UsersRouter);
app.use(ROUTES.BLOGS, BlogsRouter);
app.use(ROUTES.POSTS, PostsRouter);
app.use(ROUTES.COMMENTS, CommentsRouter);
app.use(ROUTES.TESTING, TestRouter);

app.use(APIErrorMiddleware);

app.get('/', (req: Request, res: Response) => {
    res.status(HTTP_STATUS_CODES.OK_200).json({ version: '1.0' });
});
