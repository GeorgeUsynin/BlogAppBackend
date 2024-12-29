import { ObjectId } from 'mongodb';

export namespace TDatabase {
    export type TComment = {
        _id: ObjectId;
        content: string;
        commentatorInfo: {
            userId: string;
            userLogin: string;
        };
        createdAt: string;
        postId: string;
    };

    export type TUser = {
        _id: ObjectId;
        login: string;
        email: string;
        passwordHash: string;
        createdAt: string;
        emailConfirmation: {
            isConfirmed: boolean;
            confirmationCode: string;
            expirationDate: Date;
        };
        revokedRefreshTokenList: string[];
    };

    export type TDevice = {
        _id: ObjectId;
        userId: string;
        deviceId: string;
        issuedAt: string;
        deviceName: string;
        clientIp: string;
        expirationDateOfRefreshToken: string;
    };

    export type TAPIRateLimit = {
        IP: string;
        URL: string;
        date: Date;
    };
}
