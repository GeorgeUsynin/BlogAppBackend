import { Schema } from 'express-validator';
import { CommentLikeStatusInputModel } from '../models';
import { LikeStatus } from '../../../constants';

export const updateLikeStatusValidationSchema: Schema<keyof CommentLikeStatusInputModel> = {
    likeStatus: {
        exists: {
            errorMessage: 'LikeStatus field is required',
            options: { values: 'undefined' },
        },
        isString: {
            errorMessage: 'LikeStatus field should be a string',
        },
        trim: true,
        notEmpty: {
            errorMessage: 'LikeStatus field should not be empty or contain only spaces',
        },
        isIn: {
            options: [['None', 'Like', 'Dislike']],
            errorMessage: `LikeStatus field should be equal one of the following values: ${Object.values(
                LikeStatus
            ).join(', ')}`,
        },
    },
};
