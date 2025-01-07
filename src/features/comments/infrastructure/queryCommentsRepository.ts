import { injectable } from 'inversify';
import { WithId } from 'mongodb';
import { QueryParamsCommentModel, CommentItemViewModel, CommentsPaginatedViewModel } from '../api/models';
import { APIError, createFilter, normalizeQueryParams } from '../../shared/helpers';
import { ResultStatus } from '../../../constants';
import { PostModel } from '../../posts/domain';
import { CommentModel, TComment } from '../domain';
import { LikesRepository } from '../../likes/repository';

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
    constructor(private likesRepository: LikesRepository) {}

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

        return this.mapMongoCommentToViewModel(comment, userId);
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

    async mapMongoCommentToViewModel(comment: WithId<TComment>, userId: string): Promise<CommentItemViewModel> {
        const myStatus = (await this.likesRepository.findLikeByParams({ parentId: comment._id.toString(), userId }))
            ?.status;

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
                myStatus: myStatus ?? 'None',
            },
        };
    }

    async mapCommentsToPaginationModel(values: TValues): Promise<CommentsPaginatedViewModel> {
        let items: CommentItemViewModel[] = [];

        for (let promiseItem of values.items) {
            const item = await this.mapMongoCommentToViewModel(promiseItem, values.userId);
            items.push(item);
        }

        return {
            pagesCount: Math.ceil(values.totalCount / values.pageSize),
            page: values.pageNumber,
            pageSize: values.pageSize,
            totalCount: values.totalCount,
            items,
        };
    }
}
