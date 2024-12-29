import { HydratedDocument, model, Model, Schema } from 'mongoose';
import { SETTINGS } from '../../../app-settings';

export type TDevice = {
    userId: string;
    deviceId: string;
    issuedAt: string;
    deviceName: string;
    clientIp: string;
    expirationDateOfRefreshToken: string;
};

type TDeviceModel = Model<TDevice>;

export type DeviceDocument = HydratedDocument<TDevice>;

const deviceSchema = new Schema<TDevice>({
    userId: { type: String, required: true },
    deviceId: { type: String, required: true, unique: true },
    issuedAt: { type: String, required: true },
    deviceName: { type: String, required: true },
    clientIp: { type: String, required: true },
    expirationDateOfRefreshToken: { type: String, required: true },
});

export const AuthDeviceSessionModel = model<TDevice, TDeviceModel>(
    SETTINGS.DB_COLLECTIONS.authDeviceSessionsCollection,
    deviceSchema
);
