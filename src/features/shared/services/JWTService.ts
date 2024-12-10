import jwt from 'jsonwebtoken';

export const JWTService = {
    createJWTToken: (userId: string) => {
        const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
        return token;
    },
    verifyJWTToken: (token: string) => {
        return jwt.verify(token, process.env.JWT_SECRET as string);
    },
};
