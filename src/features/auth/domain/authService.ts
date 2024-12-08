import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { usersRepository } from '../../users/repository';
import { SETTINGS } from '../../../app-settings';
import { HTTP_STATUS_CODES } from '../../../constants';

export const authService = {
    login: async (loginOrEmail: string, password: string) => {
        const user = await usersRepository.findUserByLoginOrEmail(loginOrEmail, loginOrEmail);

        if (!user) {
            return null;
        }

        const isValidPassword = await bcrypt.compare(password, user.passwordHash);

        if (!isValidPassword) {
            return null;
        }

        return { accessToken: authService.createJWTToken(user._id.toString()) };
    },
    verifyBasicAuthorization: (authorizationHeader: string) => {
        return authorizationHeader === `Basic ${SETTINGS.CODE_AUTH_BASE64}`;
    },
    verifyBearerAuthorization: async (authorizationHeader: string) => {
        const token = authorizationHeader.split(' ')[1];

        let decoded: JwtPayload | null = null;

        try {
            decoded = authService.verifyJWTToken(token) as JwtPayload;
        } catch (err) {
            return { statusCode: HTTP_STATUS_CODES.UNAUTHORIZED_401 };
        }

        if (!decoded) {
            return { statusCode: HTTP_STATUS_CODES.UNAUTHORIZED_401 };
        }

        const expirationInMilliseconds = Number(decoded.exp) * 1000;
        const isTokenExpired = Date.now() > expirationInMilliseconds;
        const isUserExists = Boolean(await usersRepository.findUserById(decoded.userId));

        if (isTokenExpired || !isUserExists) {
            return { statusCode: HTTP_STATUS_CODES.UNAUTHORIZED_401 };
        }

        return { userId: decoded.userId };
    },
    createJWTToken: (userId: string) => {
        const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
        return token;
    },
    verifyJWTToken: (token: string) => {
        return jwt.verify(token, process.env.JWT_SECRET as string);
    },
};
