import { HydratedDocument, Model } from 'mongoose';
import { authDeviceSessionMethods, authDeviceSessionStatics } from './authDeviceSessionEntity';

export type TDevice = {
    userId: string;
    deviceId: string;
    issuedAt: string;
    deviceName: string;
    clientIp: string;
    expirationDateOfRefreshToken: string;
};

type TAuthDeviceSessionStatics = typeof authDeviceSessionStatics;
type TAuthDeviceSessionMethods = typeof authDeviceSessionMethods;

export type TDeviceModel = Model<TDevice, {}, TAuthDeviceSessionMethods> & TAuthDeviceSessionStatics;

export type DeviceDocument = HydratedDocument<TDevice, TAuthDeviceSessionMethods>;
