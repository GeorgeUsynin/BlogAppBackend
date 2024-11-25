import { Schema } from 'express-validator';
import { QueryParamsBlogModel } from '../../blogs/models';

export const queryParamsBlogPostValidationSchema: Schema<Exclude<keyof QueryParamsBlogModel, 'searchNameTerm'>> = {
    sortBy: {
        optional: true,
        matches: {
            options: ['createdAt'],
            errorMessage: 'SortBy field should be equal one of the following values: createdAt',
        },
    },
    sortDirection: {
        optional: true,
        matches: {
            options: ['asc', 'desc'],
            errorMessage: 'SortDirection field should be equal one of the following values: asc, desc',
        },
    },
    pageNumber: {
        optional: true,
        isInt: {
            options: { min: 1 },
            errorMessage: 'PageNumber field should be a positive number',
        },
    },
    pageSize: {
        optional: true,
        isInt: {
            options: { min: 1 },
            errorMessage: 'PageSize field should be a positive number',
        },
    },
};
