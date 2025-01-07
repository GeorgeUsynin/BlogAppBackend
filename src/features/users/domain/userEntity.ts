import { HydratedDocument, model, Model, Schema } from 'mongoose';
import { SETTINGS } from '../../../app-settings';

const loginPattern = '^[a-zA-Z0-9_-]*$';
const emailPattern = '^[w-.]+@([w-]+.)+[w-]{2,4}$';
const defaultCreatedAt = new Date().toISOString();
const defaultRecoveryCode = null;
const defaultExpirationDate = null;
// Soft delete implementation
const defaultIsDeleted = false;

type TUserValues = {
    login: string;
    email: string;
    passwordHash: string;
    emailConfirmation: {
        isConfirmed: boolean;
        confirmationCode: string;
        expirationDate: Date;
    };
};

export class TUser {
    public login: string;
    public email: string;
    public passwordHash: string;
    public createdAt: string;
    public emailConfirmation: {
        isConfirmed: boolean;
        confirmationCode: string;
        expirationDate: Date;
    };
    public passwordRecovery: {
        recoveryCode: string | null;
        expirationDate: Date | null;
    };
    public isDeleted: boolean;

    constructor(values: TUserValues) {
        this.login = values.login;
        this.email = values.email;
        this.passwordHash = values.passwordHash;
        this.createdAt = defaultCreatedAt;
        this.emailConfirmation = values.emailConfirmation;
        this.passwordRecovery = {
            expirationDate: defaultExpirationDate,
            recoveryCode: defaultRecoveryCode,
        };
        this.isDeleted = defaultIsDeleted;
    }
}

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
    createdAt: { type: String, default: defaultCreatedAt },
    emailConfirmation: {
        isConfirmed: { type: Boolean, required: true },
        confirmationCode: { type: String, required: true },
        expirationDate: { type: Date, required: true },
    },
    passwordRecovery: {
        recoveryCode: { type: String, default: defaultRecoveryCode },
        expirationDate: { type: Date, default: defaultExpirationDate },
    },
    isDeleted: { type: Boolean, default: defaultIsDeleted },
});

// Soft delete implementation
userSchema.pre('find', function () {
    this.where({ isDeleted: false });
});
userSchema.pre('findOne', function () {
    this.where({ isDeleted: false });
});
userSchema.pre('countDocuments', function () {
    this.where({ isDeleted: false });
});

export const UserModel = model<TUser, TUserModel>(SETTINGS.DB_COLLECTIONS.usersCollection, userSchema);
