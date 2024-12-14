import { Schema } from 'express-validator';
import { RegistrationConfirmationInputModel } from '../models';

export const registrationConfirmationValidationSchema: Schema<keyof RegistrationConfirmationInputModel> = {
    code: {
        exists: {
            errorMessage: 'Code field is required',
            options: { values: 'undefined' },
        },
        isString: {
            errorMessage: 'Code field should be a string',
        },
        trim: true,
        notEmpty: {
            errorMessage: 'Code field should not be empty or contain only spaces',
        },
    },
};
