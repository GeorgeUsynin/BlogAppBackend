import { Response, Request, NextFunction } from 'express';
import { APIRateLimitService } from '../../application/services';
import { APIRateLimitRepository } from '../../infrastructure/repositories';

const apiRateLimitRepository = new APIRateLimitRepository();
const apiRateLimitService = new APIRateLimitService(apiRateLimitRepository);

export const apiRateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const IP = req.ip as string;
        const URL = req.originalUrl;
        const date = new Date();

        await apiRateLimitService.logApiRequest({ IP, URL, date });

        next();
    } catch (err) {
        next(err);
    }
};
