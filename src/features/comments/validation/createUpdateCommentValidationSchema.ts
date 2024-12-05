import { CreateUpdateCommentInputModel } from '../models';
import { Schema } from 'express-validator';

const contentMinLength = 20;
const contentMaxLength = 300;

export const createUpdateCommentValidationSchema: Schema<keyof CreateUpdateCommentInputModel> = {
    content: {
        exists: {
            errorMessage: 'Content field is required',
            options: { values: 'undefined' },
        },
        isString: {
            errorMessage: 'Content field should be a string',
        },
        trim: true,
        notEmpty: {
            errorMessage: 'Content field should not be empty or contain only spaces',
        },
        isLength: {
            options: { min: contentMinLength, max: contentMaxLength },
            errorMessage: `Content length should be from ${contentMinLength} to ${contentMaxLength} characters`,
        },
    },
};
