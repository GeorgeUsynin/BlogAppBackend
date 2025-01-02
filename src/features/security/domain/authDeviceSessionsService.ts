import { ResultStatus } from '../../../constants';
import { APIError } from '../../shared/helpers';
import { AuthDeviceSessionsRepository } from '../repository';
import { TUpdateAuthDeviceSessionParams } from '../repository/authDeviceSessionsRepository';
import { TDevice } from './authDeviceSessionEntity';

export class AuthDeviceSessionsService {
    constructor(private authDeviceSessionsRepository: AuthDeviceSessionsRepository) {}

    async addAuthDeviceSession(deviceSession: TDevice) {
        this.authDeviceSessionsRepository.addAuthDeviceSession(deviceSession);
    }

    async findDeviceById(deviceId: string) {
        return this.authDeviceSessionsRepository.findDeviceById(deviceId);
    }

    async updateAuthDeviceSession(payload: TUpdateAuthDeviceSessionParams) {
        return this.authDeviceSessionsRepository.updateAuthDeviceSession(payload);
    }

    async terminateAllOtherUserDeviceSessions(userId: string, deviceId: string) {
        return this.authDeviceSessionsRepository.terminateAllOtherUserDeviceSessions(userId, deviceId);
    }

    async terminateDeviceSessionByIDHandler(userId: string, deviceId: string) {
        const foundDevice = await this.authDeviceSessionsRepository.findDeviceById(deviceId);

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

        await this.authDeviceSessionsRepository.deleteDeviceSessionById(deviceId);
    }
}
