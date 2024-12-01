import { ObjectId } from 'mongodb';
import { QueryParamsBlogModel } from '../../blogs/models';
import { QueryParamsPostModel } from '../../posts/models';
import { QueryParamsUserModel } from '../../users/models';

export const normalizeQueryParams = (
    queryParams: QueryParamsBlogModel | QueryParamsPostModel | QueryParamsUserModel
) => {
    const { sortBy, sortDirection, pageNumber, pageSize } = queryParams;

    return {
        sortBy: sortBy || 'createdAt',
        sortDirection: sortDirection || 'desc',
        pageNumber: pageNumber ? Number(pageNumber) : 1,
        pageSize: pageSize ? Number(pageSize) : 10,
        ...('searchNameTerm' in queryParams && { searchNameTerm: queryParams.searchNameTerm || null }),
        ...('searchLoginTerm' in queryParams && { searchLoginTerm: queryParams.searchLoginTerm || null }),
        ...('searchEmailTerm' in queryParams && { searchEmailTerm: queryParams.searchEmailTerm || null }),
    };
};

type TFilterParams = {
    blogId?: string;
    id?: string;
    searchNameTerm?: ReturnType<typeof normalizeQueryParams>['searchNameTerm'];
    searchLoginTerm?: ReturnType<typeof normalizeQueryParams>['searchLoginTerm'];
    searchEmailTerm?: ReturnType<typeof normalizeQueryParams>['searchEmailTerm'];
};

export type TFilter = {
    blogId?: string;
    _id?: ObjectId;
    name?: { $regex: string; $options: string };
    login?: { $regex: string; $options: string };
    email?: { $regex: string; $options: string };
};

export const createFilter = (params: TFilterParams) => {
    const { id, searchNameTerm, blogId, searchLoginTerm, searchEmailTerm } = params;

    const filter: TFilter = {};

    if (id) filter._id = new ObjectId(id);
    if (searchNameTerm) filter.name = { $regex: searchNameTerm, $options: 'i' };
    if (blogId) filter.blogId = blogId;
    if (searchLoginTerm) filter.login = { $regex: searchLoginTerm, $options: 'i' };
    if (searchEmailTerm) filter.email = { $regex: searchEmailTerm, $options: 'i' };

    return filter;
};
