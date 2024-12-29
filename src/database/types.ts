import { ObjectId } from 'mongodb';

export namespace TDatabase {
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
