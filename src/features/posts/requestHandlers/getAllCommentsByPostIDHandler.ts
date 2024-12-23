import { NextFunction, Response } from 'express';
import type { RequestWithParamsAndQueries } from '../../shared/types';
import { QueryParamsCommentModel, CommentsPaginatedViewModel, URIParamsCommentIDModel } from '../../comments/models';
import { HTTP_STATUS_CODES } from '../../../constants';
import { queryCommentsRepository } from '../../comments/repository';

export const getAllCommentsByPostIDHandler = async (
    req: RequestWithParamsAndQueries<URIParamsCommentIDModel, QueryParamsCommentModel>,
    res: Response<CommentsPaginatedViewModel>,
    next: NextFunction
) => {
    try {
        const queryParams = req.query;
        const postId = req.params.id;

        const result = await queryCommentsRepository.getAllCommentsByPostId(queryParams, postId);

        res.status(HTTP_STATUS_CODES.OK_200).send(result);
    } catch (err) {
        next(err);
    }
};
