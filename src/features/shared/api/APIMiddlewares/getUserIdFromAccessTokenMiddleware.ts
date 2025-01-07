import { Response, Request, NextFunction } from 'express';
import { authService } from '../../../auth/router/compositionRoot';
import { container } from '../../../users/api/compositionRoot';
import { UsersService } from '../../../users/application';

const usersService = container.get(UsersService);

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
