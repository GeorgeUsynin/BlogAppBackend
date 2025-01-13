import { Response, Request, NextFunction } from 'express';
import { container } from '../../../compositionRoot';
import { APIRateLimitService } from '../../../apiRateLimit/application';

const apiRateLimitService = container.get(APIRateLimitService);

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
