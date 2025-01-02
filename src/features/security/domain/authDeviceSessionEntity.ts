import { HydratedDocument, model, Model, Schema } from 'mongoose';
import { SETTINGS } from '../../../app-settings';

type TDeviceValues = {
    userId: string;
    deviceId: string;
    issuedAt: string;
    deviceName: string;
    clientIp: string;
    expirationDateOfRefreshToken: string;
};

export class TDevice {
    public userId: string;
    public deviceId: string;
    public issuedAt: string;
    public deviceName: string;
    public clientIp: string;
    public expirationDateOfRefreshToken: string;

    constructor(values: TDeviceValues) {
        this.userId = values.userId;
        this.deviceId = values.deviceId;
        this.issuedAt = values.issuedAt;
        this.deviceName = values.deviceName;
        this.clientIp = values.clientIp;
        this.expirationDateOfRefreshToken = values.expirationDateOfRefreshToken;
    }
}

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
