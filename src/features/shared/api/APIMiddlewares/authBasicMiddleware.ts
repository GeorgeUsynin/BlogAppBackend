import { Response, Request, NextFunction } from 'express';
import { HTTP_STATUS_CODES } from '../../../../constants';
import { container } from '../../../compositionRoot';
import { ResultStatus } from '../../../../constants';
import { AuthService } from '../../../auth/application';

const authService = container.get(AuthService);

export const authBasicMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
        res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401);
        return;
    }

    const { data, status } = authService.verifyBasicAuthorization(authorizationHeader);

    if (!data.isMatched && status === ResultStatus.Unauthorized) {
        res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401);
        return;
    }

    next();
};
