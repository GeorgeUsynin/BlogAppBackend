import jwt from 'jsonwebtoken';

type TPayload = Record<string, string>;
type TOptions = jwt.SignOptions;

export const JWTService = {
    createJWTToken: function (payload: TPayload, options: TOptions) {
        const token = jwt.sign(payload, process.env.JWT_SECRET as string, options);
        return token;
    },
    verifyJWTToken: function (token: string) {
        return jwt.verify(token, process.env.JWT_SECRET as string);
    },
};
