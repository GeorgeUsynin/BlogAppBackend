import { APIError, createFilter, normalizeQueryParams } from '../../shared/helpers';
import { QueryParamsBlogModel, BlogsPaginatedViewModel, BlogItemViewModel } from '../models';
import { BlogModel, TBlog } from '../domain';
import { TDatabase } from '../../../database';
import { WithId } from 'mongodb';
import { ResultStatus } from '../../../constants';

type TFilter = ReturnType<typeof createFilter>;
type TValues = {
    items: WithId<TBlog>[];
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
        const blog = await BlogModel.findById(blogId).lean();

        if (!blog) {
            throw new APIError({
                status: ResultStatus.NotFound,
                message: '',
            });
        }

        return this.mapMongoBlogToViewModel(blog);
    },
    async getTotalCountOfFilteredBlogs(filter: TFilter) {
        return BlogModel.countDocuments(filter);
    },
    async findBlogItemsByParamsAndFilter(
        params: ReturnType<typeof normalizeQueryParams>,
        filter: ReturnType<typeof createFilter>
    ) {
        const { sortBy, sortDirection, pageNumber, pageSize } = params;
        return BlogModel.find(filter)
            .sort({ [sortBy]: sortDirection === 'desc' ? -1 : 1 })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .lean();
    },
    mapMongoBlogToViewModel(blog: WithId<TBlog>): BlogItemViewModel {
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
