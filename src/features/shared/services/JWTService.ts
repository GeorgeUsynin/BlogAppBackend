import jwt, { JwtPayload } from 'jsonwebtoken';

type TPayload = Record<string, string>;
type TOptions = jwt.SignOptions;

export const JWTService = {
    createJWTToken(payload: TPayload, options: TOptions) {
        const token = jwt.sign(payload, process.env.JWT_SECRET as string, options);
        return token;
    },
    verifyJWTToken(token: string) {
        return jwt.verify(token, process.env.JWT_SECRET as string);
    },
    async parseJWTToken(token: string) {
        let decoded: JwtPayload | null = null;

        try {
            decoded = JWTService.verifyJWTToken(token) as JwtPayload;
        } catch (err) {
            console.error('Error verifying JWT token:', err);
        }

        return decoded || null;
    },
};
