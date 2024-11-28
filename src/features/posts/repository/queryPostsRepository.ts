import { createFilter, normalizeQueryParams } from '../../shared/helpers';
import { QueryParamsPostModel, PostsPaginatedViewModel } from '../models';
import { postsService } from '../domain';
import { postsCollection, TDatabase } from '../../../database/mongoDB';
import { WithId } from 'mongodb';

type TFilter = ReturnType<typeof createFilter>;
type TValues = {
    items: WithId<TDatabase.TPost>[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
};

export const queryPostsRepository = {
    findAllPosts: async (queryParams: QueryParamsPostModel, blogId?: string) => {
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
    mapPostsToPaginationModel: (values: TValues): PostsPaginatedViewModel => {
        return {
            pagesCount: Math.ceil(values.totalCount / values.pageSize),
            page: values.pageNumber,
            pageSize: values.pageSize,
            totalCount: values.totalCount,
            items: values.items.map(postsService.mapMongoPostToViewModel),
        };
    },
};
