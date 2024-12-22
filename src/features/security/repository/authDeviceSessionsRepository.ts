import { TDatabase, authDeviceSessionsCollection } from '../../../database/mongoDB';

type TUpdateAuthDeviceSessionParams = {
    deviceId: string;
    issuedAt: string;
    expirationDateOfRefreshToken: string;
};

export const authDeviceSessionsRepository = {
    async addAuthDeviceSession(deviceSession: Omit<TDatabase.TDevice, '_id'>) {
        //@ts-expect-error since ObjectId will be created by MongoDB we don't need to pass it
        return authDeviceSessionsCollection.insertOne(deviceSession);
    },
    async findDeviceById(deviceId: string) {
        return authDeviceSessionsCollection.findOne({ deviceId });
    },
    async updateAuthDeviceSession(payload: TUpdateAuthDeviceSessionParams) {
        const { deviceId, expirationDateOfRefreshToken, issuedAt } = payload;

        return authDeviceSessionsCollection.findOneAndUpdate(
            { deviceId },
            { $set: { issuedAt, expirationDateOfRefreshToken } }
        );
    },
    async terminateAllOtherUserDeviceSessions(userId: string, deviceId: string) {
        return authDeviceSessionsCollection.deleteMany({ $and: [{ userId }, { deviceId: { $ne: deviceId } }] });
    },
    async deleteDeviceSessionById(deviceId: string) {
        return authDeviceSessionsCollection.deleteOne({ deviceId });
    },
};
