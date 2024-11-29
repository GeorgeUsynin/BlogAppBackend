import { createFilter, normalizeQueryParams } from '../../shared/helpers';
import { QueryParamsBlogModel, BlogsPaginatedViewModel, BlogItemViewModel } from '../models';
import { blogsCollection, TDatabase } from '../../../database/mongoDB';
import { WithId, ObjectId } from 'mongodb';

type TFilter = ReturnType<typeof createFilter>;
type TValues = {
    items: WithId<TDatabase.TBlog>[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
};

export const queryBlogsRepository = {
    getAllBlogs: async (queryParams: QueryParamsBlogModel) => {
        const params = normalizeQueryParams(queryParams);
        const filter = createFilter({ searchNameTerm: params.searchNameTerm });

        const items = await queryBlogsRepository.findBlogItemsByParamsAndFilter(params, filter);
        const totalCount = await queryBlogsRepository.getTotalCountOfFilteredBlogs(filter);

        return queryBlogsRepository.mapBlogsToPaginationModel({
            items,
            totalCount,
            pageNumber: params.pageNumber,
            pageSize: params.pageSize,
        });
    },
    getBlogById: async (blogId: string) => {
        const blog = await blogsCollection.findOne({ _id: new ObjectId(blogId) });

        if (!blog) return null;

        return queryBlogsRepository.mapMongoBlogToViewModel(blog);
    },
    getTotalCountOfFilteredBlogs: async (filter: TFilter) => blogsCollection.countDocuments(filter),
    findBlogItemsByParamsAndFilter: async (
        params: ReturnType<typeof normalizeQueryParams>,
        filter: ReturnType<typeof createFilter>
    ) => {
        const { sortBy, sortDirection, pageNumber, pageSize } = params;
        return blogsCollection
            .find(filter)
            .sort({ [sortBy]: sortDirection === 'desc' ? -1 : 1 })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();
    },
    // For now we are doing mapping in the query repository, but we can move it to the presentation layer
    // There can be different approaches, but for now it's ok
    // However, we need to keep in mind that the usual approach is to do mapping in the presentation layer
    mapMongoBlogToViewModel: (blog: WithId<TDatabase.TBlog>): BlogItemViewModel => ({
        id: blog._id.toString(),
        description: blog.description,
        name: blog.name,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership,
    }),
    mapBlogsToPaginationModel: (values: TValues): BlogsPaginatedViewModel => {
        return {
            pagesCount: Math.ceil(values.totalCount / values.pageSize),
            page: values.pageNumber,
            pageSize: values.pageSize,
            totalCount: values.totalCount,
            items: values.items.map(queryBlogsRepository.mapMongoBlogToViewModel),
        };
    },
};
