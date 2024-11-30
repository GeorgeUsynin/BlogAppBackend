import { PaginatedViewModel } from '../../shared/types';
/**
 * Represents the paginated response model for blogs.
 */
export type UsersPaginatedViewModel = PaginatedViewModel<UserItemViewModel>;

/**
 * Represents the view model for a user.
 * This is typically the format in which user data is presented back to the client.
 */
export type UserItemViewModel = {
    /**
     * The unique identifier of the user.
     * @type {string}
     * @required
     */
    id: string;

    /**
     * The unique login for the user.
     * @type {string}
     * @required
     */
    login: string;

    /**
     * The unique email address of the user.
     * @type {string}
     * @required
     */
    email: string;

    /**
     * The timestamp when the user was created.
     * @type {string}
     * @format date-time
     * @example "2024-11-30T10:01:28.690Z"
     * @required
     */
    createdAt: string;
};
