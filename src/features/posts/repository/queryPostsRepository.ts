import { createFilter, normalizeQueryParams } from '../../shared/helpers';
import { QueryParamsPostModel, PostsPaginatedViewModel, PostItemViewModel } from '../models';
import { blogsCollection, postsCollection, TDatabase } from '../../../database/mongoDB';
import { ObjectId, WithId } from 'mongodb';

type TFilter = ReturnType<typeof createFilter>;
type TValues = {
    items: WithId<TDatabase.TPost>[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
};

export const queryPostsRepository = {
    getAllPosts: async (queryParams: QueryParamsPostModel, blogId?: string) => {
        const params = normalizeQueryParams(queryParams);
        const filter = createFilter({ blogId });

        const items = await queryPostsRepository.findPostItemsByParamsAndFilter(params, filter);
        const totalCount = await queryPostsRepository.findTotalCountOfFilteredPosts(filter);

        return queryPostsRepository.mapPostsToPaginationModel({
            items,
            totalCount,
            pageNumber: params.pageNumber,
            pageSize: params.pageSize,
        });
    },
    getAllPostsByBlogId: async (queryParams: QueryParamsPostModel, blogId: string) => {
        const blog = await blogsCollection.findOne({ _id: new ObjectId(blogId) });

        if (!blog) {
            return null;
        }

        return queryPostsRepository.getAllPosts(queryParams, blogId);
    },
    getPostById: async (postId: string) => {
        const post = await postsCollection.findOne({ _id: new ObjectId(postId) });
        if (!post) return null;
        return queryPostsRepository.mapMongoPostToViewModel(post);
    },
    findTotalCountOfFilteredPosts: async (filter: TFilter) => {
        return postsCollection.countDocuments(filter);
    },
    findPostItemsByParamsAndFilter: async (
        params: ReturnType<typeof normalizeQueryParams>,
        filter: ReturnType<typeof createFilter>
    ) => {
        const { sortBy, sortDirection, pageNumber, pageSize } = params;
        return postsCollection
            .find(filter)
            .sort({ [sortBy]: sortDirection === 'desc' ? -1 : 1 })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();
    },
    // For now we are doing mapping in the query repository, but we can move it to the presentation layer
    // There can be different approaches, but for now it's ok
    // However, we need to keep in mind that the usual approach is to do mapping in the presentation layer
    mapMongoPostToViewModel: (post: WithId<TDatabase.TPost>): PostItemViewModel => ({
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        blogName: post.blogName,
        content: post.content,
        blogId: post.blogId,
        createdAt: post.createdAt,
    }),
    mapPostsToPaginationModel: (values: TValues): PostsPaginatedViewModel => {
        return {
            pagesCount: Math.ceil(values.totalCount / values.pageSize),
            page: values.pageNumber,
            pageSize: values.pageSize,
            totalCount: values.totalCount,
            items: values.items.map(queryPostsRepository.mapMongoPostToViewModel),
        };
    },
};
