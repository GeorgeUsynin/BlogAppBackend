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

        let myStatus: keyof typeof LikeStatus = LikeStatus.None;

        if (userId) {
            const like = await LikeModel.findOne({ parentId: post._id.toString(), userId });
            myStatus = like ? like.status : LikeStatus.None;
        }

        return this.mapMongoPostToViewModel(post, myStatus);
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

    async mapMongoPostToViewModel(post: WithId<TPost>, myStatus: keyof typeof LikeStatus): Promise<PostItemViewModel> {
        const newestLikesRaw = await LikeModel.find({ parentId: post._id.toString(), status: LikeStatus.Like })
            .sort({ createdAt: -1 })
            .limit(3);

        const likesUsersIds = newestLikesRaw.map(like => like.userId);
        const users = await UserModel.find({ _id: { $in: likesUsersIds } });

        const newestLikes = newestLikesRaw.map(like => {
            const user = users.find(user => user._id.toString() === like.userId);
            return {
                addedAt: like.createdAt,
                login: user?.login!,
                userId: like.userId,
            };
        });

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
                myStatus,
                newestLikes,
            },
        };
    }

    async mapPostsToPaginationModel(values: TValues): Promise<PostsPaginatedViewModel> {
        const postsIds = values.items.map(item => item._id.toString());
        const likes = await LikeModel.find({ parentId: { $in: postsIds } });
        const items = values.items.map(item => {
            const like = likes.find(like => like.parentId === item._id.toString());
            const myStatus = like && like.userId === values.userId ? like.status : LikeStatus.None;
            return this.mapMongoPostToViewModel(item, myStatus);
        });

        return {
            pagesCount: Math.ceil(values.totalCount / values.pageSize),
            page: values.pageNumber,
            pageSize: values.pageSize,
            totalCount: values.totalCount,
            items: await Promise.all(items),
        };
    }
}
