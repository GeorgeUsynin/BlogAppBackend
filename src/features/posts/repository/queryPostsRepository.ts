import { WithId } from 'mongodb';
import { APIError, createFilter, normalizeQueryParams } from '../../shared/helpers';
import { QueryParamsPostModel, PostsPaginatedViewModel, PostItemViewModel } from '../models';
import { ResultStatus } from '../../../constants';
import { BlogModel } from '../../blogs/domain';
import { PostModel, TPost } from '../domain';

type TFilter = ReturnType<typeof createFilter>;
type TValues = {
    items: WithId<TPost>[];
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
        const blog = await BlogModel.findById(blogId).lean();

        if (!blog) {
            throw new APIError({
                status: ResultStatus.NotFound,
                message: '',
            });
        }

        return this.getAllPosts(queryParams, blogId);
    },
    async getPostById(postId: string) {
        const post = await PostModel.findById(postId);

        if (!post) {
            throw new APIError({
                status: ResultStatus.NotFound,
                message: '',
            });
        }

        return this.mapMongoPostToViewModel(post);
    },
    async findTotalCountOfFilteredPosts(filter: TFilter) {
        return PostModel.countDocuments(filter);
    },
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
    },
    mapMongoPostToViewModel(post: WithId<TPost>): PostItemViewModel {
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
