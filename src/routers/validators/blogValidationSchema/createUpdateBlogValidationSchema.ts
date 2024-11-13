import { CreateUpdateBlogInputModel } from '../../../models/blogs';
import { Schema } from 'express-validator';

export const createUpdateBlogValidationSchema: Schema<keyof CreateUpdateBlogInputModel> = {
    name: {
        exists: {
            errorMessage: 'Name field is required',
            options: { values: 'undefined' },
        },
        isString: {
            errorMessage: 'Name field should be a string',
        },
        trim: true,
        notEmpty: {
            errorMessage: 'Name field should not be empty or contain only spaces',
        },
        isLength: {
            options: { max: 15 },
            errorMessage: 'Max length should be 15 characters',
        },
    },
    description: {
        exists: {
            errorMessage: 'Description field is required',
            options: { values: 'undefined' },
        },
        isString: {
            errorMessage: 'Description field should be a string',
        },
        trim: true,
        notEmpty: {
            errorMessage: 'Description field should not be empty or contain only spaces',
        },
        isLength: {
            options: { max: 500 },
            errorMessage: 'Max length should be 500 characters',
        },
    },
    websiteUrl: {
        exists: {
            errorMessage: 'WebsiteUrl field is required',
            options: { values: 'undefined' },
        },
        isString: {
            errorMessage: 'WebsiteUrl field should be a string',
        },
        trim: true,
        notEmpty: {
            errorMessage: 'WebsiteUrl field should not be empty or contain only spaces',
        },
        isLength: {
            options: { max: 100 },
            errorMessage: 'Max length should be 100 characters',
        },
        isURL: {
            errorMessage: `WebsiteUrl should match the specified URL pattern`,
        },
    },
};
