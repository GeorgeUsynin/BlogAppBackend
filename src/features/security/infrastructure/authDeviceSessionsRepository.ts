import { injectable } from 'inversify';
import { AuthDeviceSessionModel, DeviceDocument, TDevice } from '../domain';

export type TUpdateAuthDeviceSessionParams = {
    deviceId: string;
    issuedAt: string;
    expirationDateOfRefreshToken: string;
};

@injectable()
export class AuthDeviceSessionsRepository {
    async createAuthDeviceSession(deviceSession: TDevice) {
        return AuthDeviceSessionModel.create(deviceSession);
    }

    async findDeviceById(deviceId: string) {
        return AuthDeviceSessionModel.findOne({ deviceId });
    }

    async deleteAllOtherUserDeviceSessions(userId: string, deviceId: string) {
        return AuthDeviceSessionModel.deleteMany({ $and: [{ userId }, { deviceId: { $ne: deviceId } }] });
    }

    async deleteDeviceSessionById(deviceId: string) {
        return AuthDeviceSessionModel.findOneAndDelete({ deviceId });
    }

    async save(authDeviceSession: DeviceDocument) {
        return authDeviceSession.save();
    }
}
