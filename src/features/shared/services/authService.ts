import { SETTINGS } from '../../../app-settings';
import { JWTService } from './JWTService';
import { Result } from '../types';
import { ResultStatus } from '../../../constants';

export const authService = {
    verifyBasicAuthorization(authorizationHeader: string): Result<{ isMatched: boolean }> {
        const isMatched = authorizationHeader === `Basic ${SETTINGS.CODE_AUTH_BASE64}`;

        return { data: { isMatched }, status: isMatched ? ResultStatus.Success : ResultStatus.Unauthorized };
    },
    async verifyBearerAuthorization(authorizationHeader: string): Promise<Result<{ userId: string } | null>> {
        const [type, token] = authorizationHeader.split(' ');

        if (type !== 'Bearer') {
            return { data: null, status: ResultStatus.Unauthorized };
        }

        const decoded = await JWTService.parseJWTToken(token);

        if (!decoded) {
            return { data: null, status: ResultStatus.Unauthorized };
        }

        return { data: { userId: decoded.userId }, status: ResultStatus.Success };
    },
};
