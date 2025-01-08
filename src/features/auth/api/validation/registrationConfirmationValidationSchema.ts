import { Schema } from 'express-validator';
import { RegistrationConfirmationInputDTO } from '../../application';

export const registrationConfirmationValidationSchema: Schema<keyof RegistrationConfirmationInputDTO> = {
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
