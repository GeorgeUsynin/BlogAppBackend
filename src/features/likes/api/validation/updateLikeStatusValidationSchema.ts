import { Schema } from 'express-validator';
import { LikeStatus } from '../../../../constants';
import { CommentLikeStatusInputDTO } from '../../application';

export const updateLikeStatusValidationSchema: Schema<keyof CommentLikeStatusInputDTO> = {
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
