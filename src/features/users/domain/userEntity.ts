import { HydratedDocument, model, Model, Schema } from 'mongoose';
import { SETTINGS } from '../../../app-settings';

const loginPattern = '^[a-zA-Z0-9_-]*$';
const emailPattern = '^[w-.]+@([w-]+.)+[w-]{2,4}$';

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
};

type TUserModel = Model<TUser>;

export type UserDocument = HydratedDocument<TUser>;

const userSchema = new Schema<TUser>({
    login: {
        type: String,
        minlength: 3,
        maxLength: 10,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /^[a-zA-Z0-9_-]*$/.test(v);
            },
            message: props => `Login should match the specified ${loginPattern} pattern`,
        },
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
            },
            message: props => `Login should match the specified ${emailPattern} pattern`,
        },
    },
    passwordHash: { type: String, required: true },
    createdAt: { type: String, required: true },
    emailConfirmation: {
        isConfirmed: { type: Boolean, required: true },
        confirmationCode: { type: String, required: true },
        expirationDate: { type: Date, required: true },
    },
    passwordRecovery: {
        recoveryCode: { type: String, default: null },
        expirationDate: { type: Date, default: null },
    },
});

export const UserModel = model<TUser, TUserModel>(SETTINGS.DB_COLLECTIONS.usersCollection, userSchema);
