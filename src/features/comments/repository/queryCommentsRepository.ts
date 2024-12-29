import { ObjectId, WithId } from 'mongodb';
import { QueryParamsCommentModel, CommentItemViewModel, CommentsPaginatedViewModel } from '../models';
import { APIError, createFilter, normalizeQueryParams } from '../../shared/helpers';
import { ResultStatus } from '../../../constants';
import { PostModel } from '../../posts/domain';
import { CommentModel, TComment } from '../domain';

type TFilter = ReturnType<typeof createFilter>;
type TValues = {
    items: WithId<TComment>[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
};

export const queryCommentsRepository = {
    async getAllCommentsByPostId(queryParams: QueryParamsCommentModel, postId: string) {
        const post = await PostModel.findById(postId);

        if (!post) {
            throw new APIError({
                status: ResultStatus.NotFound,
                message: '',
            });
        }

        const params = normalizeQueryParams(queryParams);
        const filter = createFilter({ postId });

        const items = await this.findCommentItemsByParamsAndFilter(params, filter);
        const totalCount = await this.findTotalCountOfFilteredComments(filter);

        return this.mapCommentsToPaginationModel({
            items,
            totalCount,
            pageNumber: params.pageNumber,
            pageSize: params.pageSize,
        });
    },
    async getCommentById(commentId: string) {
        const comment = await CommentModel.findById(commentId);

        if (!comment) {
            throw new APIError({
                status: ResultStatus.NotFound,
                message: '',
            });
        }

        return this.mapMongoCommentToViewModel(comment);
    },
    async findTotalCountOfFilteredComments(filter: TFilter) {
        return CommentModel.countDocuments(filter);
    },
    async findCommentItemsByParamsAndFilter(
        params: ReturnType<typeof normalizeQueryParams>,
        filter: ReturnType<typeof createFilter>
    ) {
        const { sortBy, sortDirection, pageNumber, pageSize } = params;
        return CommentModel.find(filter)
            .sort({ [sortBy]: sortDirection === 'desc' ? -1 : 1 })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .lean();
    },
    mapMongoCommentToViewModel(comment: WithId<TComment>): CommentItemViewModel {
        return {
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin,
            },
            createdAt: comment.createdAt,
        };
    },
    mapCommentsToPaginationModel(values: TValues): CommentsPaginatedViewModel {
        return {
            pagesCount: Math.ceil(values.totalCount / values.pageSize),
            page: values.pageNumber,
            pageSize: values.pageSize,
            totalCount: values.totalCount,
            items: values.items.map(this.mapMongoCommentToViewModel),
        };
    },
};
