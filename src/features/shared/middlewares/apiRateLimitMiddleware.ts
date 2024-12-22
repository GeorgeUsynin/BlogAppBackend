import { Response, Request, NextFunction } from 'express';
import { APIRateLimitService } from '../services';

export const apiRateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const IP = req.ip as string;
        const URL = req.originalUrl;
        const date = new Date();

        await APIRateLimitService.logApiRequest({ IP, URL, date });

        next();
    } catch (err) {
        next(err);
    }
};
