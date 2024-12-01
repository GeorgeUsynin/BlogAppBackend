import { createFilter, normalizeQueryParams } from '../../shared/helpers';
import { QueryParamsUserModel, UserItemViewModel, UsersPaginatedViewModel } from '../models';
import { usersCollection, TDatabase } from '../../../database/mongoDB';
import { WithId, ObjectId } from 'mongodb';

type TFilter = ReturnType<typeof createFilter>;
type TValues = {
    items: WithId<TDatabase.TUser>[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
};

export const queryUsersRepository = {
    getAllUsers: async (queryParams: QueryParamsUserModel) => {
        const params = normalizeQueryParams(queryParams);
        const filter = createFilter(
            {
                searchEmailTerm: params.searchEmailTerm,
                searchLoginTerm: params.searchLoginTerm,
            },
            'or'
        );

        const items = await queryUsersRepository.findUserItemsByParamsAndFilter(params, filter);
        const totalCount = await queryUsersRepository.getTotalCountOfFilteredUsers(filter);

        return queryUsersRepository.mapUsersToPaginationModel({
            items,
            totalCount,
            pageNumber: params.pageNumber,
            pageSize: params.pageSize,
        });
    },
    getUserById: async (userId: string) => {
        const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

        if (!user) return null;

        return queryUsersRepository.mapMongoUserToViewModel(user);
    },
    getTotalCountOfFilteredUsers: async (filter: TFilter) => usersCollection.countDocuments(filter),
    findUserItemsByParamsAndFilter: async (
        params: ReturnType<typeof normalizeQueryParams>,
        filter: ReturnType<typeof createFilter>
    ) => {
        const { sortBy, sortDirection, pageNumber, pageSize } = params;
        return usersCollection
            .find(filter)
            .sort({ [sortBy]: sortDirection === 'desc' ? -1 : 1 })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();
    },
    findUserByLoginOrEmail: async (login: string, email: string) =>
        usersCollection.findOne({ $or: [{ login }, { email }] }),
    // For now we are doing mapping in the query repository, but we can move it to the presentation layer
    // There can be different approaches, but for now it's ok
    // However, we need to keep in mind that the usual approach is to do mapping in the presentation layer
    mapMongoUserToViewModel: (user: WithId<TDatabase.TUser>): UserItemViewModel => ({
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
    }),
    mapUsersToPaginationModel: (values: TValues): UsersPaginatedViewModel => {
        return {
            pagesCount: Math.ceil(values.totalCount / values.pageSize),
            page: values.pageNumber,
            pageSize: values.pageSize,
            totalCount: values.totalCount,
            items: values.items.map(queryUsersRepository.mapMongoUserToViewModel),
        };
    },
};
