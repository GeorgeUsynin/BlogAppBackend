import { injectable } from 'inversify';
import { WithId } from 'mongodb';
import { QueryParamsCommentModel, CommentItemViewModel, CommentsPaginatedViewModel } from '../api/models';
import { APIError, createFilter, normalizeQueryParams } from '../../shared/helpers';
import { LikeStatus, ResultStatus } from '../../../constants';
import { PostModel } from '../../posts/domain';
import { CommentModel, TComment } from '../domain';
import { LikeModel } from '../../likes/domain';

type TFilter = ReturnType<typeof createFilter>;
type TValues = {
    items: WithId<TComment>[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    userId: string;
};

@injectable()
export class QueryCommentsRepository {
    async getAllCommentsByPostId(queryParams: QueryParamsCommentModel, postId: string, userId: string) {
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
            userId,
        });
    }

    async getCommentById(commentId: string, userId: string) {
        const comment = await CommentModel.findById(commentId);

        if (!comment) {
            throw new APIError({
                status: ResultStatus.NotFound,
                message: '',
            });
        }

        let myStatus: keyof typeof LikeStatus = LikeStatus.None;

        if (userId) {
            const like = await LikeModel.findOne({ parentId: comment._id.toString(), userId });
            myStatus = like ? like.status : LikeStatus.None;
        }

        return this.mapMongoCommentToViewModel(comment, myStatus);
    }

    async findTotalCountOfFilteredComments(filter: TFilter) {
        return CommentModel.countDocuments(filter);
    }

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
    }

    mapMongoCommentToViewModel(comment: WithId<TComment>, myStatus: keyof typeof LikeStatus): CommentItemViewModel {
        return {
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin,
            },
            createdAt: comment.createdAt,
            likesInfo: {
                dislikesCount: comment.likesInfo.dislikesCount,
                likesCount: comment.likesInfo.likesCount,
                myStatus,
            },
        };
    }

    async mapCommentsToPaginationModel(values: TValues): Promise<CommentsPaginatedViewModel> {
        const commentsIds = values.items.map(item => item._id.toString());
        const likes = await LikeModel.find({ parentId: { $in: commentsIds }, userId: values.userId });
        const items = values.items.map(item => {
            const like = likes.find(like => like.parentId === item._id.toString());
            const myStatus = like ? like.status : LikeStatus.None;
            return this.mapMongoCommentToViewModel(item, myStatus);
        });

        return {
            pagesCount: Math.ceil(values.totalCount / values.pageSize),
            page: values.pageNumber,
            pageSize: values.pageSize,
            totalCount: values.totalCount,
            items,
        };
    }
}
