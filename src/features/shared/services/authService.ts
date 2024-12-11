import { JwtPayload } from 'jsonwebtoken';
import { usersRepository } from '../../users/repository';
import { SETTINGS } from '../../../app-settings';
import { JWTService } from './JWTService';
import { Result } from '../types';
import { ResultStatus } from '../../../constants';

export const authService = {
    verifyBasicAuthorization: (authorizationHeader: string): Result<{ isMatched: boolean }> => {
        const isMatched = authorizationHeader === `Basic ${SETTINGS.CODE_AUTH_BASE64}`;

        return { data: { isMatched }, status: isMatched ? ResultStatus.Success : ResultStatus.Unauthorized };
    },
    verifyBearerAuthorization: async (authorizationHeader: string): Promise<Result<{ userId: string } | null>> => {
        const [type, token] = authorizationHeader.split(' ');

        if (type !== 'Bearer') {
            return { data: null, status: ResultStatus.Unauthorized };
        }

        let decoded: JwtPayload | null = null;

        try {
            decoded = JWTService.verifyJWTToken(token) as JwtPayload;
        } catch (err) {
            return { data: null, status: ResultStatus.Unauthorized };
        }

        if (!decoded) {
            return { data: null, status: ResultStatus.Unauthorized };
        }

        const isUserExists = Boolean(await usersRepository.findUserById(decoded.userId));

        if (!isUserExists) {
            return { data: null, status: ResultStatus.Unauthorized };
        }

        return { data: { userId: decoded.userId }, status: ResultStatus.Success };
    },
};
