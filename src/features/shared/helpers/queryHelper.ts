import { ObjectId } from 'mongodb';
import { QueryParamsBlogModel } from '../../blogs/models';
import { QueryParamsPostModel } from '../../posts/models';

export const normalizeQueryParams = (queryParams: QueryParamsBlogModel | QueryParamsPostModel) => {
    const { sortBy, sortDirection, pageNumber, pageSize } = queryParams;

    return {
        sortBy: sortBy || 'createdAt',
        sortDirection: sortDirection || 'desc',
        pageNumber: pageNumber ? Number(pageNumber) : 1,
        pageSize: pageSize ? Number(pageSize) : 10,
        ...('searchNameTerm' in queryParams && { searchNameTerm: queryParams.searchNameTerm || null }),
    };
};

type TFilterParams = {
    id?: string;
    searchNameTerm?: ReturnType<typeof normalizeQueryParams>['searchNameTerm'];
};

export type TFilter = {
    _id?: ObjectId;
    name?: { $regex: string; $options: string };
};

export const createFilter = (params: TFilterParams) => {
    const { id, searchNameTerm } = params;

    const filter: TFilter = {};

    if (id) filter._id = new ObjectId(id);
    if (searchNameTerm) filter.name = { $regex: searchNameTerm, $options: 'i' };

    return filter;
};
