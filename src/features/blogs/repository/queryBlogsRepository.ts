import { createFilter, normalizeQueryParams } from '../../shared/helpers';
import { QueryParamsBlogModel, BlogsPaginatedViewModel } from '../models';
import { blogsService } from '../domain';
import { blogsCollection, TDatabase } from '../../../database/mongoDB';
import { WithId } from 'mongodb';

type TFilter = ReturnType<typeof createFilter>;
type TValues = {
    items: WithId<TDatabase.TBlog>[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
};

export const queryBlogsRepository = {
    findAllBlogs: async (queryParams: QueryParamsBlogModel) => {
        const params = normalizeQueryParams(queryParams);
        const filter = createFilter({ searchNameTerm: params.searchNameTerm });

        const items = await queryBlogsRepository.findBlogItemsByParamsAndFilter(params, filter);
        const totalCount = await queryBlogsRepository.findTotalCountOfFilteredBlogs(filter);

        return queryBlogsRepository.mapBlogsToPaginationModel({
            items,
            totalCount,
            pageNumber: params.pageNumber,
            pageSize: params.pageSize,
        });
    },
    findTotalCountOfFilteredBlogs: async (filter: TFilter) => {
        return blogsCollection.countDocuments(filter);
    },
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
    mapBlogsToPaginationModel: (values: TValues): BlogsPaginatedViewModel => {
        return {
            pagesCount: Math.ceil(values.totalCount / values.pageSize),
            page: values.pageNumber,
            pageSize: values.pageSize,
            totalCount: values.totalCount,
            items: values.items.map(blogsService.mapMongoBlogToViewModel),
        };
    },
};
