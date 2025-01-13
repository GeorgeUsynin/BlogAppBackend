import { Response, Request, NextFunction } from 'express';
import { HTTP_STATUS_CODES, ResultStatus } from '../../../../constants';
import { container } from '../../../compositionRoot';
import { UsersService } from '../../../users/application';
import { AuthService } from '../../../auth/application';

const authService = container.get(AuthService);
const usersService = container.get(UsersService);

export const authBearerMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
        res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401);
        return;
    }

    const { data, status } = await authService.verifyBearerAuthorization(authorizationHeader);

    if (!data) {
        if (status === ResultStatus.Unauthorized) {
            res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401);
            return;
        } else {
            res.sendStatus(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);
            return;
        }
    }

    const isUserExists = Boolean(await usersService.findUserById(data.userId));

    if (!isUserExists) {
        res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401);
        return;
    }

    req.userId = data.userId;

    next();
};
