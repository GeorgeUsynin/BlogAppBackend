import { Response, Request, NextFunction } from 'express';
import { authService } from '../../../auth/router/compositionRoot';
import { usersService } from '../../../users/router/compositionRoot';

export const getUserIdFromAccessTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    req.userId = '';
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
        next();
        return;
    }

    const { data } = await authService.verifyBearerAuthorization(authorizationHeader);

    if (!data) {
        next();
        return;
    }

    const isUserExists = Boolean(await usersService.findUserById(data.userId));

    if (!isUserExists) {
        next();
        return;
    }

    req.userId = data.userId;

    next();
};
