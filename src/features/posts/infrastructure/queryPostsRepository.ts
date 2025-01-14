import { injectable } from 'inversify';
import { WithId } from 'mongodb';
import { APIError, createFilter, normalizeQueryParams } from '../../shared/helpers';
import { QueryParamsPostModel, PostsPaginatedViewModel, PostItemViewModel } from '../api/models';
import { LikeStatus, ResultStatus } from '../../../constants';
import { BlogModel } from '../../blogs/domain';
import { PostModel, TPost } from '../domain';
import { LikeModel } from '../../likes/domain';
import { UserModel } from '../../users/domain';

type TFilter = ReturnType<typeof createFilter>;
type TValues = {
    items: WithId<TPost>[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    userId: string;
};

@injectable()
export class QueryPostsRepository {
    async getAllPosts(queryParams: QueryParamsPostModel, userId: string, blogId?: string) {
        const params = normalizeQueryParams(queryParams);
        const filter = createFilter({ blogId });

        const items = await this.findPostItemsByParamsAndFilter(params, filter);
        const totalCount = await this.findTotalCountOfFilteredPosts(filter);

        return this.mapPostsToPaginationModel({
            items,
            totalCount,
            pageNumber: params.pageNumber,
            pageSize: params.pageSize,
            userId,
        });
    }

    async getAllPostsByBlogId(queryParams: QueryParamsPostModel, userId: string, blogId: string) {
        const blog = await BlogModel.findById(blogId).lean();

        if (!blog) {
            throw new APIError({
                status: ResultStatus.NotFound,
                message: '',
            });
        }

        return this.getAllPosts(queryParams, userId, blogId);
    }

    async getPostById(postId: string, userId: string) {
        const post = await PostModel.findById(postId);

        if (!post) {
            throw new APIError({
                status: ResultStatus.NotFound,
                message: '',
            });
        }

        return this.mapMongoPostToViewModel(post, userId);
    }

    async findTotalCountOfFilteredPosts(filter: TFilter) {
        return PostModel.countDocuments(filter);
    }

    async findPostItemsByParamsAndFilter(
        params: ReturnType<typeof normalizeQueryParams>,
        filter: ReturnType<typeof createFilter>
    ) {
        const { sortBy, sortDirection, pageNumber, pageSize } = params;
        return PostModel.find(filter)
            .sort({ [sortBy]: sortDirection === 'desc' ? -1 : 1 })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .lean();
    }

    async mapMongoPostToViewModel(post: WithId<TPost>, userId: string): Promise<PostItemViewModel> {
        const myStatus = (await LikeModel.findOne({ $and: [{ parentId: post._id.toString(), userId }] }))?.status;
        const newestLikesRaw = await LikeModel.find({ parentId: post._id.toString(), status: LikeStatus.Like })
            .sort({ createdAt: -1 })
            .limit(3)
            .lean();

        const newestLikes = await Promise.all(
            newestLikesRaw.map(async like => {
                const user = await UserModel.findById(like.userId);
                return {
                    addedAt: like.createdAt,
                    login: user?.login!,
                    userId: like.userId,
                };
            })
        );

        return {
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            blogName: post.blogName,
            content: post.content,
            blogId: post.blogId,
            createdAt: post.createdAt,
            extendedLikesInfo: {
                dislikesCount: post.likesInfo.dislikesCount,
                likesCount: post.likesInfo.likesCount,
                myStatus: myStatus ?? 'None',
                newestLikes,
            },
        };
    }

    async mapPostsToPaginationModel(values: TValues): Promise<PostsPaginatedViewModel> {
        const items = await Promise.all(values.items.map(item => this.mapMongoPostToViewModel(item, values.userId)));

        return {
            pagesCount: Math.ceil(values.totalCount / values.pageSize),
            page: values.pageNumber,
            pageSize: values.pageSize,
            totalCount: values.totalCount,
            items,
        };
    }
}
