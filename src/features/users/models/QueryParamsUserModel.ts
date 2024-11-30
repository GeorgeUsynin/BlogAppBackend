/**
 * Represents the query parameters model for fetching posts.
 */
export type QueryParamsUserModel = {
    /**
     * The current page number for pagination. Determines which portion of the results to return.
     * Default value: 1
     * @type {number}
     */
    pageNumber?: number;

    /**
     * The number of items to be displayed per page. Determines the size of each portion.
     * Default value: 10
     * @type {number}
     */
    pageSize?: number;

    /**
     * The field by which to sort the results.
     * Default value: 'createdAt'
     * @type {'login' | 'email' | 'createdAt'}
     */
    sortBy?: 'login' | 'email' | 'createdAt';

    /**
     * The direction of sorting, either ascending or descending.
     * Default value: 'desc'
     * Available values: 'asc', 'desc'
     * @type {'asc' | 'desc'}
     */
    sortDirection?: 'asc' | 'desc';

    /**
     * The search term for login.
     * Default value: 'null'
     * @type {string}
     * @nullable
     */
    searchLoginTerm?: string;

    /**
     * The search term for email.
     * Default value: 'null'
     * @type {string}
     * @nullable
     */
    searchEmailTerm?: string;
};
