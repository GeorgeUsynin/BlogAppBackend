import { LoginInputModel } from '../models';
import { Schema } from 'express-validator';

export const loginValidationSchema: Schema<keyof LoginInputModel> = {
    loginOrEmail: {
        exists: {
            errorMessage: 'LoginOrEmail field is required',
            options: { values: 'undefined' },
        },
        isString: {
            errorMessage: 'LoginOrEmail field should be a string',
        },
        trim: true,
        notEmpty: {
            errorMessage: 'LoginOrEmail field should not be empty or contain only spaces',
        },
    },
    password: {
        exists: {
            errorMessage: 'Password field is required',
            options: { values: 'undefined' },
        },
        isString: {
            errorMessage: 'Password field should be a string',
        },
        trim: true,
        notEmpty: {
            errorMessage: 'Password field should not be empty or contain only spaces',
        },
    },
};
