import cors from 'cors';
import express, { Request, Response } from 'express';
import { HTTP_STATUS_CODES } from './constants';

export const app = express(); // create appP

const a = {
    b: 1,
    a: 2,
};

app.use(express.json()); // adding body parse middleware
app.use(cors()); // allow all clients to use our backend endpoints

app.get('/', (req: Request, res: Response) => {
    res.status(HTTP_STATUS_CODES.OK_200).json({ version: '1.0' });
});
