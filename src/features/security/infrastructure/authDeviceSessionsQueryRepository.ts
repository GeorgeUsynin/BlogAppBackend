import { injectable } from 'inversify';
import { AuthDeviceViewModel } from '../api/models';
import { AuthDeviceSessionModel, TDevice } from '../domain';

@injectable()
export class AuthDeviceSessionsQueryRepository {
    async getAllUserAuthDeviceSessions(userId: string) {
        const deviceSessions = await AuthDeviceSessionModel.find({ userId }).lean();

        return deviceSessions.map(this.mapUserAuthDeviceSessionsToViewModel);
    }

    mapUserAuthDeviceSessionsToViewModel(deviceSession: TDevice): AuthDeviceViewModel {
        return {
            deviceId: deviceSession.deviceId,
            ip: deviceSession.clientIp,
            lastActiveDate: deviceSession.issuedAt,
            title: deviceSession.deviceName,
        };
    }
}
