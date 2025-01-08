import { Schema } from 'express-validator';
import { PasswordRecoveryInputDTO } from '../../application';

const emailPattern = '^[w-.]+@([w-]+.)+[w-]{2,4}$';

export const passwordRecoveryValidationSchema: Schema<keyof PasswordRecoveryInputDTO> = {
    email: {
        exists: {
            errorMessage: 'Email field is required',
            options: { values: 'undefined' },
        },
        isString: {
            errorMessage: 'Email field should be a string',
        },
        trim: true,
        notEmpty: {
            errorMessage: 'Email field should not be empty or contain only spaces',
        },
        isEmail: {
            errorMessage: `Email should match the specified ${emailPattern} pattern`,
        },
    },
};
