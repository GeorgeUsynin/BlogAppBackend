import { APIError, createFilter, normalizeQueryParams } from '../../shared/helpers';
import { QueryParamsPostModel, PostsPaginatedViewModel, PostItemViewModel } from '../models';
import { blogsCollection, postsCollection, TDatabase } from '../../../database';
import { ObjectId, WithId } from 'mongodb';
import { ResultStatus } from '../../../constants';

type TFilter = ReturnType<typeof createFilter>;
type TValues = {
    items: WithId<TDatabase.TPost>[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
};

export const queryPostsRepository = {
    async getAllPosts(queryParams: QueryParamsPostModel, blogId?: string) {
        const params = normalizeQueryParams(queryParams);
        const filter = createFilter({ blogId });

        const items = await this.findPostItemsByParamsAndFilter(params, filter);
        const totalCount = await this.findTotalCountOfFilteredPosts(filter);

        return this.mapPostsToPaginationModel({
            items,
            totalCount,
            pageNumber: params.pageNumber,
            pageSize: params.pageSize,
        });
    },
    async getAllPostsByBlogId(queryParams: QueryParamsPostModel, blogId: string) {
        const blog = await blogsCollection.findOne({ _id: new ObjectId(blogId) });

        if (!blog) {
            throw new APIError({
                status: ResultStatus.NotFound,
                message: '',
            });
        }

        return this.getAllPosts(queryParams, blogId);
    },
    async getPostById(postId: string) {
        const post = await postsCollection.findOne({ _id: new ObjectId(postId) });

        if (!post) {
            throw new APIError({
                status: ResultStatus.NotFound,
                message: '',
            });
        }

        return this.mapMongoPostToViewModel(post);
    },
    async findTotalCountOfFilteredPosts(filter: TFilter) {
        return postsCollection.countDocuments(filter);
    },
    async findPostItemsByParamsAndFilter(
        params: ReturnType<typeof normalizeQueryParams>,
        filter: ReturnType<typeof createFilter>
    ) {
        const { sortBy, sortDirection, pageNumber, pageSize } = params;
        return postsCollection
            .find(filter)
            .sort({ [sortBy]: sortDirection === 'desc' ? -1 : 1 })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();
    },
    mapMongoPostToViewModel(post: WithId<TDatabase.TPost>): PostItemViewModel {
        return {
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            blogName: post.blogName,
            content: post.content,
            blogId: post.blogId,
            createdAt: post.createdAt,
        };
    },
    mapPostsToPaginationModel(values: TValues): PostsPaginatedViewModel {
        return {
            pagesCount: Math.ceil(values.totalCount / values.pageSize),
            page: values.pageNumber,
            pageSize: values.pageSize,
            totalCount: values.totalCount,
            items: values.items.map(this.mapMongoPostToViewModel.bind(this)),
        };
    },
};
