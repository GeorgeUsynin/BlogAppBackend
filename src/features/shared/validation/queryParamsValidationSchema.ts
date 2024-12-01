import { Schema } from 'express-validator';
import { SharedQueryParamsModel } from '../types';

type TOwner = 'blogs' | 'posts' | 'users';

const sortByConfig = {
    blogs: ['name', 'createdAt'],
    posts: ['title', 'blogName', 'createdAt'],
    users: ['login', 'email', 'createdAt'],
};

export const queryParamsValidationSchema = (owner: TOwner): Schema<keyof SharedQueryParamsModel> => {
    return {
        sortBy: {
            optional: true,
            isIn: {
                options: [sortByConfig[owner]],
                errorMessage: `SortBy field should be equal one of the following values: ${sortByConfig[owner].join(
                    ', '
                )}`,
            },
        },
        sortDirection: {
            optional: true,
            isIn: {
                options: [['asc', 'desc']], // List of allowed values for sortDirection
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
};
