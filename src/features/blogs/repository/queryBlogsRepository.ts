import { APIError, createFilter, normalizeQueryParams } from '../../shared/helpers';
import { QueryParamsBlogModel, BlogsPaginatedViewModel, BlogItemViewModel } from '../models';
import { blogsCollection, TDatabase } from '../../../database/mongoDB';
import { WithId, ObjectId } from 'mongodb';
import { ResultStatus } from '../../../constants';

type TFilter = ReturnType<typeof createFilter>;
type TValues = {
    items: WithId<TDatabase.TBlog>[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
};

export const queryBlogsRepository = {
    async getAllBlogs(queryParams: QueryParamsBlogModel) {
        const params = normalizeQueryParams(queryParams);
        const filter = createFilter({ searchNameTerm: params.searchNameTerm });

        const items = await this.findBlogItemsByParamsAndFilter(params, filter);
        const totalCount = await this.getTotalCountOfFilteredBlogs(filter);

        return this.mapBlogsToPaginationModel({
            items,
            totalCount,
            pageNumber: params.pageNumber,
            pageSize: params.pageSize,
        });
    },
    async getBlogById(blogId: string) {
        const blog = await blogsCollection.findOne({ _id: new ObjectId(blogId) });

        if (!blog) {
            throw new APIError({
                status: ResultStatus.NotFound,
                message: '',
            });
        }

        return this.mapMongoBlogToViewModel(blog);
    },
    async getTotalCountOfFilteredBlogs(filter: TFilter) {
        return blogsCollection.countDocuments(filter);
    },
    async findBlogItemsByParamsAndFilter(
        params: ReturnType<typeof normalizeQueryParams>,
        filter: ReturnType<typeof createFilter>
    ) {
        const { sortBy, sortDirection, pageNumber, pageSize } = params;
        return blogsCollection
            .find(filter)
            .sort({ [sortBy]: sortDirection === 'desc' ? -1 : 1 })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();
    },
    mapMongoBlogToViewModel(blog: WithId<TDatabase.TBlog>): BlogItemViewModel {
        return {
            id: blog._id.toString(),
            description: blog.description,
            name: blog.name,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership,
        };
    },
    mapBlogsToPaginationModel(values: TValues): BlogsPaginatedViewModel {
        return {
            pagesCount: Math.ceil(values.totalCount / values.pageSize),
            page: values.pageNumber,
            pageSize: values.pageSize,
            totalCount: values.totalCount,
            items: values.items.map(this.mapMongoBlogToViewModel),
        };
    },
};
