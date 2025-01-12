import { model, Schema } from 'mongoose';
import { SETTINGS } from '../../../app-settings';
import { DeviceDocument, TDevice, TDeviceModel } from './types';
import { CreateAuthDeviceSessionDTO } from '../application/dto';
import { APIError } from '../../shared/helpers';
import { ResultStatus } from '../../../constants';

const deviceSchema = new Schema<TDevice>({
    userId: { type: String, required: true },
    deviceId: { type: String, required: true, unique: true },
    issuedAt: { type: String, required: true },
    deviceName: { type: String, required: true },
    clientIp: { type: String, required: true },
    expirationDateOfRefreshToken: { type: String, required: true },
});

export const authDeviceSessionStatics = {
    createAuthDeviceSession(dto: CreateAuthDeviceSessionDTO) {
        const newAuthDeviceSession = new AuthDeviceSessionModel(dto);

        return newAuthDeviceSession;
    },
};

export const authDeviceSessionMethods = {
    isDeviceOwner(userId: string) {
        const that = this as DeviceDocument;

        if (that.userId !== userId) {
            throw new APIError({
                status: ResultStatus.Forbidden,
                message: '',
            });
        }

        return true;
    },
};

deviceSchema.statics = authDeviceSessionStatics;
deviceSchema.methods = authDeviceSessionMethods;

export const AuthDeviceSessionModel = model<TDevice, TDeviceModel>(
    SETTINGS.DB_COLLECTIONS.authDeviceSessionsCollection,
    deviceSchema
);
