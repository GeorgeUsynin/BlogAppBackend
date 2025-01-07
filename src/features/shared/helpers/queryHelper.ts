import { ObjectId } from 'mongodb';
import { QueryParamsBlogModel } from '../../blogs/api';
import { QueryParamsPostModel } from '../../posts/api';
import { QueryParamsUserModel } from '../../users/api';
import { LikeStatus } from '../../../constants';

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
    postId?: string;
    id?: string;
    searchNameTerm?: ReturnType<typeof normalizeQueryParams>['searchNameTerm'];
    searchLoginTerm?: ReturnType<typeof normalizeQueryParams>['searchLoginTerm'];
    searchEmailTerm?: ReturnType<typeof normalizeQueryParams>['searchEmailTerm'];
    likeStatus?: keyof typeof LikeStatus;
};

export type TFilter = {
    blogId?: string;
    postId?: string;
    _id?: ObjectId;
    name?: { $regex: string; $options: string };
    login?: { $regex: string; $options: string };
    email?: { $regex: string; $options: string };
};

type TFilterOperator = 'or' | 'and';

export const createFilter = (params: TFilterParams, operator?: TFilterOperator) => {
    const { id, searchNameTerm, blogId, postId, searchLoginTerm, searchEmailTerm } = params;

    const filter: { [key: string]: any }[] = []; // Array to store individual conditions

    if (id) filter.push({ _id: new ObjectId(id) });

    if (blogId) filter.push({ blogId });

    if (postId) filter.push({ postId });

    if (searchNameTerm) filter.push({ name: { $regex: searchNameTerm, $options: 'i' } });

    if (searchLoginTerm) filter.push({ login: { $regex: searchLoginTerm, $options: 'i' } });

    if (searchEmailTerm) filter.push({ email: { $regex: searchEmailTerm, $options: 'i' } });

    // If there are multiple filters, return a query with the operator, otherwise return a single filter or an empty object
    if (filter.length > 1) {
        switch (operator) {
            case 'or':
                return { $or: filter };
            case 'and':
                return { $and: filter };
        }
    }

    return filter[0] || {};
};
