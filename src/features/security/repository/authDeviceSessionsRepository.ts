import { injectable } from 'inversify';
import { AuthDeviceSessionModel, TDevice } from '../domain';

export type TUpdateAuthDeviceSessionParams = {
    deviceId: string;
    issuedAt: string;
    expirationDateOfRefreshToken: string;
};

@injectable()
export class AuthDeviceSessionsRepository {
    async addAuthDeviceSession(deviceSession: TDevice) {
        return AuthDeviceSessionModel.create(deviceSession);
    }

    async findDeviceById(deviceId: string) {
        return AuthDeviceSessionModel.findOne({ deviceId });
    }

    async updateAuthDeviceSession(payload: TUpdateAuthDeviceSessionParams) {
        const { deviceId, expirationDateOfRefreshToken, issuedAt } = payload;

        return AuthDeviceSessionModel.findOneAndUpdate({ deviceId }, { issuedAt, expirationDateOfRefreshToken });
    }

    async terminateAllOtherUserDeviceSessions(userId: string, deviceId: string) {
        return AuthDeviceSessionModel.deleteMany({ $and: [{ userId }, { deviceId: { $ne: deviceId } }] });
    }

    async deleteDeviceSessionById(deviceId: string) {
        return AuthDeviceSessionModel.findOneAndDelete({ deviceId });
    }
}
