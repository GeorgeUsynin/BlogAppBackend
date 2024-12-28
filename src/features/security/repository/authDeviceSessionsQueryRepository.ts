import { AuthDeviceViewModel } from '../models';
import { authDeviceSessionsCollection, TDatabase } from '../../../database';

export const authDeviceSessionsQueryRepository = {
    async getAllUserAuthDeviceSessions(userId: string) {
        const deviceSessions = await authDeviceSessionsCollection.find({ userId }).toArray();

        return deviceSessions.map(this.mapUserAuthDeviceSessionsToViewModel);
    },
    mapUserAuthDeviceSessionsToViewModel(deviceSession: TDatabase.TDevice): AuthDeviceViewModel {
        return {
            deviceId: deviceSession.deviceId,
            ip: deviceSession.clientIp,
            lastActiveDate: deviceSession.issuedAt,
            title: deviceSession.deviceName,
        };
    },
};
