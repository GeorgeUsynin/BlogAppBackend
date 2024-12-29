import { APIError, createFilter, normalizeQueryParams } from '../../shared/helpers';
import { QueryParamsUserModel, UserItemViewModel, UsersPaginatedViewModel } from '../models';
import { TDatabase } from '../../../database';
import { WithId, ObjectId } from 'mongodb';
import { ResultStatus } from '../../../constants';
import { TUser, UserModel } from '../domain';

type TFilter = ReturnType<typeof createFilter>;
type TValues = {
    items: WithId<TUser>[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
};

export const queryUsersRepository = {
    async getAllUsers(queryParams: QueryParamsUserModel) {
        const params = normalizeQueryParams(queryParams);
        const filter = createFilter(
            {
                searchEmailTerm: params.searchEmailTerm,
                searchLoginTerm: params.searchLoginTerm,
            },
            'or'
        );

        const items = await this.findUserItemsByParamsAndFilter(params, filter);
        const totalCount = await this.getTotalCountOfFilteredUsers(filter);

        return this.mapUsersToPaginationModel({
            items,
            totalCount,
            pageNumber: params.pageNumber,
            pageSize: params.pageSize,
        });
    },
    async getUserById(userId: string) {
        const user = await UserModel.findById(userId);

        if (!user) {
            throw new APIError({ status: ResultStatus.NotFound, message: 'User not found' });
        }

        return this.mapMongoUserToViewModel(user);
    },
    async getUserInfoById(userId: string) {
        const user = await UserModel.findById(userId);

        if (!user) {
            throw new APIError({
                status: ResultStatus.Unauthorized,
                message: 'User not found',
            });
        }

        return {
            email: user.email,
            login: user.login,
            userId: user._id.toString(),
        };
    },
    async getTotalCountOfFilteredUsers(filter: TFilter) {
        return UserModel.countDocuments(filter);
    },
    async findUserItemsByParamsAndFilter(
        params: ReturnType<typeof normalizeQueryParams>,
        filter: ReturnType<typeof createFilter>
    ) {
        const { sortBy, sortDirection, pageNumber, pageSize } = params;
        return UserModel.find(filter)
            .sort({ [sortBy]: sortDirection === 'desc' ? -1 : 1 })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .lean();
    },
    mapMongoUserToViewModel(user: WithId<TUser>): UserItemViewModel {
        return {
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt,
        };
    },
    mapUsersToPaginationModel(values: TValues): UsersPaginatedViewModel {
        return {
            pagesCount: Math.ceil(values.totalCount / values.pageSize),
            page: values.pageNumber,
            pageSize: values.pageSize,
            totalCount: values.totalCount,
            items: values.items.map(user => this.mapMongoUserToViewModel(user)),
        };
    },
};
