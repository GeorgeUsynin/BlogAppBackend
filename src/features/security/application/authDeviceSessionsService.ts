import { inject, injectable } from 'inversify';
import { ResultStatus } from '../../../constants';
import { APIError } from '../../shared/helpers';
import { AuthDeviceSessionsRepository } from '../infrastructure';
import { TUpdateAuthDeviceSessionParams } from '../infrastructure/authDeviceSessionsRepository';
import { TDevice } from '../domain/authDeviceSessionEntity';

@injectable()
export class AuthDeviceSessionsService {
    constructor(
        @inject(AuthDeviceSessionsRepository) private authDeviceSessionsRepository: AuthDeviceSessionsRepository
    ) {}

    async createAuthDeviceSession(deviceSession: TDevice) {
        this.authDeviceSessionsRepository.createAuthDeviceSession(deviceSession);
    }

    async findDeviceById(deviceId: string) {
        return this.authDeviceSessionsRepository.findDeviceById(deviceId);
    }

    async updateAuthDeviceSession(payload: TUpdateAuthDeviceSessionParams) {
        const { deviceId, expirationDateOfRefreshToken, issuedAt } = payload;

        const foundAuthDeviceSession = await this.authDeviceSessionsRepository.findDeviceById(deviceId);

        if (!foundAuthDeviceSession) {
            throw new APIError({
                status: ResultStatus.NotFound,
                message: 'Device was not found',
            });
        }

        foundAuthDeviceSession.issuedAt = issuedAt;
        foundAuthDeviceSession.expirationDateOfRefreshToken = expirationDateOfRefreshToken;

        return this.authDeviceSessionsRepository.save(foundAuthDeviceSession);
    }

    async terminateAllOtherUserDeviceSessions(userId: string, deviceId: string) {
        return this.authDeviceSessionsRepository.deleteAllOtherUserDeviceSessions(userId, deviceId);
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
