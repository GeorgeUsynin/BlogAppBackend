import { Schema } from 'express-validator';
import { NewPasswordInputDTO } from '../../application';

const passwordMinLength = 6;
const passwordMaxLength = 20;

export const newPasswordValidationSchema: Schema<keyof NewPasswordInputDTO> = {
    newPassword: {
        exists: {
            errorMessage: 'NewPassword field is required',
            options: { values: 'undefined' },
        },
        isString: {
            errorMessage: 'NewPassword field should be a string',
        },
        trim: true,
        notEmpty: {
            errorMessage: 'NewPassword field should not be empty or contain only spaces',
        },
        isLength: {
            options: { min: passwordMinLength, max: passwordMaxLength },
            errorMessage: `NewPassword length should be from ${passwordMinLength} to ${passwordMaxLength} characters`,
        },
    },
    recoveryCode: {
        exists: {
            errorMessage: 'RecoveryCode field is required',
            options: { values: 'undefined' },
        },
        isString: {
            errorMessage: 'RecoveryCode field should be a string',
        },
        trim: true,
        notEmpty: {
            errorMessage: 'RecoveryCode field should not be empty or contain only spaces',
        },
    },
};
