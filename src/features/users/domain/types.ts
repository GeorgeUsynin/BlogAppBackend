import { HydratedDocument, Model } from 'mongoose';
import { userMethods, userStatics } from './userEntity';

export type TUser = {
    login: string;
    email: string;
    passwordHash: string;
    createdAt: string;
    emailConfirmation: {
        isConfirmed: boolean;
        confirmationCode: string;
        expirationDate: Date;
    };
    passwordRecovery: {
        recoveryCode: string | null;
        expirationDate: Date | null;
    };
    isDeleted: boolean;
};

type UserStatics = typeof userStatics;
type UserMethods = typeof userMethods;

export type TUserModel = Model<TUser, {}, UserMethods> & UserStatics;

export type UserDocument = HydratedDocument<TUser, UserMethods>;
