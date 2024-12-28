import { ObjectId } from 'mongodb';

export namespace TDatabase {
    export type TBlog = {
        _id: ObjectId;
        name: string;
        description: string;
        websiteUrl: string;
        createdAt: string;
        isMembership: boolean;
    };

    export type TPost = {
        _id: ObjectId;
        title: string;
        shortDescription: string;
        content: string;
        blogId: string;
        blogName: string;
        createdAt: string;
    };

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
