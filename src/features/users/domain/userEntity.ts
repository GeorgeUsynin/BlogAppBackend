import { model, Schema } from 'mongoose';
import { SETTINGS } from '../../../app-settings';
import { CreateUserDTO } from '../application/dto';
import { randomUUID } from 'crypto';
import { add } from 'date-fns';
import { TUser, TUserModel, UserDocument } from './types';
import { APIError } from '../../shared/helpers';
import { ResultStatus } from '../../../constants';

const loginPattern = '^[a-zA-Z0-9_-]*$';
const emailPattern = '^[w-.]+@([w-]+.)+[w-]{2,4}$';

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
    createdAt: { type: String, default: () => new Date().toISOString() },
    emailConfirmation: {
        isConfirmed: { type: Boolean, default: false },
        confirmationCode: { type: String, default: () => randomUUID() },
        expirationDate: {
            type: Date,
            default: () => add(new Date(), { hours: SETTINGS.CONFIRMATION_CODE_EXPIRATION_TIME_IN_HOURS }),
        },
    },
    passwordRecovery: {
        recoveryCode: { type: String, default: null },
        expirationDate: { type: Date, default: null },
    },
    isDeleted: { type: Boolean, default: false },
});

export const userStatics = {
    createUnconfirmedUser(dto: CreateUserDTO) {
        const newUser = new UserModel(dto);

        return newUser;
    },

    createConfirmedUser(dto: CreateUserDTO) {
        const newUser = new UserModel(dto);

        newUser.emailConfirmation.isConfirmed = true;

        return newUser;
    },
};

export const userMethods = {
    canBeConfirmed(code: string) {
        const that = this as UserDocument;

        if (that.emailConfirmation.isConfirmed) {
            throw new APIError({
                status: ResultStatus.BadRequest,
                field: 'code',
                message: 'Email already confirmed',
            });
        }

        if (that.emailConfirmation.confirmationCode !== code) {
            throw new APIError({
                status: ResultStatus.BadRequest,
                field: 'code',
                message: 'Invalid code',
            });
        }

        if (Date.now() > that.emailConfirmation.expirationDate.getTime()) {
            throw new APIError({
                status: ResultStatus.BadRequest,
                field: 'code',
                message: 'Code expired',
            });
        }

        return true;
    },

    confirmUserEmail(code: string) {
        const that = this as UserDocument;

        if (!that.canBeConfirmed(code)) {
            throw new APIError({
                status: ResultStatus.Failure,
                field: '',
                message: 'Failure in user confirmation validation',
            });
        }

        that.emailConfirmation.isConfirmed = true;
    },

    canResendEmailConfirmationCode() {
        const that = this as UserDocument;

        if (that.emailConfirmation.isConfirmed) {
            throw new APIError({
                status: ResultStatus.BadRequest,
                field: 'email',
                message: 'Email already confirmed',
            });
        }

        return true;
    },

    generateEmailConfirmationCode() {
        const that = this as UserDocument;

        const newConfirmationCode = randomUUID();
        const newExpirationDate = add(new Date(), { hours: SETTINGS.CONFIRMATION_CODE_EXPIRATION_TIME_IN_HOURS });

        that.emailConfirmation.confirmationCode = newConfirmationCode;
        that.emailConfirmation.expirationDate = newExpirationDate;
    },

    generatePasswordRecoveryCode() {
        const that = this as UserDocument;

        const recoveryCode = randomUUID();
        const expirationDate = add(new Date(), { hours: SETTINGS.RECOVERY_CODE_EXPIRATION_TIME_IN_HOURS });

        that.passwordRecovery.recoveryCode = recoveryCode;
        that.passwordRecovery.expirationDate = expirationDate;
    },

    canChangePassword(code: string) {
        const that = this as UserDocument;

        if (that.passwordRecovery.recoveryCode !== code) {
            throw new APIError({
                status: ResultStatus.BadRequest,
                field: 'code',
                message: 'Invalid code',
            });
        }

        if (Date.now() > that.passwordRecovery.expirationDate!.getTime()) {
            throw new APIError({
                status: ResultStatus.BadRequest,
                field: 'recoveryCode',
                message: 'Code expired',
            });
        }

        return true;
    },

    changePassword(code: string, passwordHash: string) {
        const that = this as UserDocument;

        if (!that.canChangePassword(code)) {
            throw new APIError({
                status: ResultStatus.Failure,
                field: '',
                message: 'Failure in user change password validation',
            });
        }

        that.passwordHash = passwordHash;
    },
};

userSchema.statics = userStatics;
userSchema.methods = userMethods;

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
