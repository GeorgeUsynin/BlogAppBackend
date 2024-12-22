import { ResultStatus } from '../../../constants';
import { APIError } from '../../shared/helpers';
import { authDeviceSessionsRepository } from '../repository';

export const authDeviceSessionsService = {
    async findDeviceById(deviceId: string) {
        return authDeviceSessionsRepository.findDeviceById(deviceId);
    },
    async terminateAllOtherUserDeviceSessions(userId: string, deviceId: string) {
        return authDeviceSessionsRepository.terminateAllOtherUserDeviceSessions(userId, deviceId);
    },
    async terminateDeviceSessionByIDHandler(userId: string, deviceId: string) {
        const foundDevice = await authDeviceSessionsRepository.findDeviceById(deviceId);

        if (!foundDevice) {
            throw new APIError({
                status: ResultStatus.NotFound,
                message: 'Device was not found',
            });
        }

        if (foundDevice.userId !== userId) {
            throw new APIError({
                status: ResultStatus.Forbidden,
                message: '',
            });
        }

        await authDeviceSessionsRepository.deleteDeviceSessionById(deviceId);
    },
};
