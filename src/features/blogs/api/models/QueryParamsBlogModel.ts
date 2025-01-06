/**
 * Represents the query parameters model for fetching blogs.
 */
export type QueryParamsBlogModel = {
    /**
     * A search term used to filter blogs by name. The blog name must contain this term in any position.
     * Default value: null
     * @type {string}
     * @nullable
     */
    searchNameTerm?: string;

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
     * @type {'name' | 'createdAt'}
     */
    sortBy?: 'name' | 'createdAt';

    /**
     * The direction of sorting, either ascending or descending.
     * Default value: 'desc'
     * Available values: 'asc', 'desc'
     * @type {'asc' | 'desc'}
     */
    sortDirection?: 'asc' | 'desc';
};
