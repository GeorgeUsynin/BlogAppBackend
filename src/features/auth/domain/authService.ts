import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { SETTINGS } from '../../../app-settings';
import { ResultStatus } from '../../../constants';
import { JWTService } from '../../shared/services/JWTService';
import { APIError, getDeviceName } from '../../shared/helpers';
import { UsersRepository } from '../../users/repository';
import { AuthDeviceSessionsService } from '../../security/domain';

type TLoginPayload = {
    loginOrEmail: string;
    password: string;
    clientIp: string;
    userAgent?: string;
};

const accessTokenExpirationTime = SETTINGS.ACCESS_TOKEN_EXPIRATION_TIME;
const refreshTokenExpirationTime = SETTINGS.REFRESH_TOKEN_EXPIRATION_TIME;

export class AuthService {
    constructor(
        private JWTService: JWTService,
        private authDeviceSessionsService: AuthDeviceSessionsService,
        private usersRepository: UsersRepository
    ) {}

    verifyBasicAuthorization(authorizationHeader: string) {
        const isMatched = authorizationHeader === `Basic ${SETTINGS.CODE_AUTH_BASE64}`;

        return { data: { isMatched }, status: isMatched ? ResultStatus.Success : ResultStatus.Unauthorized };
    }

    async verifyBearerAuthorization(authorizationHeader: string) {
        const [type, token] = authorizationHeader.split(' ');

        if (type !== 'Bearer') {
            return { data: null, status: ResultStatus.Unauthorized };
        }

        const decoded = await this.JWTService.parseJWTToken(token);

        if (!decoded) {
            return { data: null, status: ResultStatus.Unauthorized };
        }

        return { data: { userId: decoded.userId }, status: ResultStatus.Success };
    }

    async login(payload: TLoginPayload) {
        const { clientIp, loginOrEmail, password, userAgent } = payload;

        const user = await this.usersRepository.findUserByLoginOrEmail(loginOrEmail, loginOrEmail);

        if (!user) {
            throw new APIError({
                status: ResultStatus.Unauthorized,
                message: 'Invalid credentials',
            });
        }

        // check if user's email is confirmed
        if (!user.emailConfirmation.isConfirmed) {
            throw new APIError({
                status: ResultStatus.Unauthorized,
                message: 'Email is not confirmed',
            });
        }

        const isValidPassword = await bcrypt.compare(password, user.passwordHash);

        if (!isValidPassword) {
            throw new APIError({
                status: ResultStatus.Unauthorized,
                message: 'Invalid credentials',
            });
        }

        const deviceId = randomUUID();

        const accessToken = this.JWTService.createJWTToken(
            { userId: user._id.toString() },
            { expiresIn: accessTokenExpirationTime }
        );
        const refreshToken = this.JWTService.createJWTToken(
            { userId: user._id.toString(), deviceId },
            { expiresIn: refreshTokenExpirationTime }
        );

        const decodedRefreshToken = await this.JWTService.parseJWTToken(refreshToken);
        const issuedAt = new Date(Number(decodedRefreshToken?.iat) * 1000).toISOString();
        const expirationDateOfRefreshToken = new Date(Number(decodedRefreshToken?.exp) * 1000).toISOString();

        await this.authDeviceSessionsService.addAuthDeviceSession({
            userId: user._id.toString(),
            deviceId,
            issuedAt,
            deviceName: getDeviceName(userAgent),
            clientIp,
            expirationDateOfRefreshToken,
        });

        return { accessToken, refreshToken };
    }

    async logout(userId: string, deviceId: string) {
        await this.authDeviceSessionsService.terminateDeviceSessionByIDHandler(userId, deviceId);
    }

    async updateTokens(userId: string, deviceId: string) {
        const accessToken = this.JWTService.createJWTToken({ userId }, { expiresIn: accessTokenExpirationTime });
        const refreshToken = this.JWTService.createJWTToken(
            { userId, deviceId },
            { expiresIn: refreshTokenExpirationTime }
        );

        const decodedRefreshToken = await this.JWTService.parseJWTToken(refreshToken);
        const issuedAt = new Date(Number(decodedRefreshToken?.iat) * 1000).toISOString();
        const expirationDateOfRefreshToken = new Date(Number(decodedRefreshToken?.exp) * 1000).toISOString();

        await this.authDeviceSessionsService.updateAuthDeviceSession({
            deviceId,
            issuedAt,
            expirationDateOfRefreshToken,
        });

        return { newAccessToken: accessToken, newRefreshToken: refreshToken };
    }
}
