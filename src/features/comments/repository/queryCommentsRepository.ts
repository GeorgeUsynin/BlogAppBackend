import { ObjectId, WithId } from 'mongodb';
import { QueryParamsCommentModel, CommentItemViewModel, CommentsPaginatedViewModel } from '../models';
import { commentsCollection, postsCollection, TDatabase } from '../../../database/mongoDB';
import { createFilter, normalizeQueryParams } from '../../shared/helpers';

type TFilter = ReturnType<typeof createFilter>;
type TValues = {
    items: WithId<TDatabase.TComment>[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
};

export const queryCommentsRepository = {
    getAllCommentsByPostId: async (queryParams: QueryParamsCommentModel, postId: string) => {
        const post = await postsCollection.findOne({ _id: new ObjectId(postId) });

        if (!post) {
            return null;
        }

        const params = normalizeQueryParams(queryParams);
        const filter = createFilter({ postId });

        const items = await queryCommentsRepository.findCommentItemsByParamsAndFilter(params, filter);
        const totalCount = await queryCommentsRepository.findTotalCountOfFilteredComments(filter);

        return queryCommentsRepository.mapCommentsToPaginationModel({
            items,
            totalCount,
            pageNumber: params.pageNumber,
            pageSize: params.pageSize,
        });
    },
    getCommentById: async (commentId: string) => {
        const comment = await commentsCollection.findOne({ _id: new ObjectId(commentId) });

        if (!comment) return null;

        return queryCommentsRepository.mapMongoCommentToViewModel(comment);
    },
    findTotalCountOfFilteredComments: async (filter: TFilter) => {
        return commentsCollection.countDocuments(filter);
    },
    findCommentItemsByParamsAndFilter: async (
        params: ReturnType<typeof normalizeQueryParams>,
        filter: ReturnType<typeof createFilter>
    ) => {
        const { sortBy, sortDirection, pageNumber, pageSize } = params;
        return commentsCollection
            .find(filter)
            .sort({ [sortBy]: sortDirection === 'desc' ? -1 : 1 })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();
    },
    // For now we are doing mapping in the query repository, but we can move it to the presentation layer
    // There can be different approaches, but for now it's ok
    // However, we need to keep in mind that the usual approach is to do mapping in the presentation layer
    mapMongoCommentToViewModel: (comment: WithId<TDatabase.TComment>): CommentItemViewModel => ({
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: {
            userId: comment.commentatorInfo.userId,
            userLogin: comment.commentatorInfo.userLogin,
        },
        createdAt: comment.createdAt,
    }),
    mapCommentsToPaginationModel: (values: TValues): CommentsPaginatedViewModel => {
        return {
            pagesCount: Math.ceil(values.totalCount / values.pageSize),
            page: values.pageNumber,
            pageSize: values.pageSize,
            totalCount: values.totalCount,
            items: values.items.map(queryCommentsRepository.mapMongoCommentToViewModel),
        };
    },
};
