import { Request, Response, NextFunction } from 'express';
import { connectToDatabase } from './mongoDB';
import { SETTINGS } from '../app-settings';
import { HTTP_STATUS_CODES } from '../constants';

export const databaseConnectionMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const isConnected = await connectToDatabase(SETTINGS.MONGO_URL, SETTINGS.DB_NAME);

    if (!isConnected) {
        console.error('MongoDB connection error');
        res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500).send('Database connection error');
        return; // Explicitly terminate the function
    }

    next(); // Pass control to the next middleware
};
