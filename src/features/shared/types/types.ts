import type { Request } from 'express';

export type PaginatedViewModel<T> = {
    /**
     * The total number of pages available.
     * @type {number}
     * @required
     */
    pagesCount: number;

    /**
     * The current page number.
     * @type {number}
     * @required
     */
    page: number;

    /**
     * The number of items displayed per page.
     * @type {number}
     * @required
     */
    pageSize: number;

    /**
     * The total number of items available.
     * @type {number}
     * @required
     */
    totalCount: number;

    /**
     * The list of items on the current page.
     * @type {Array<T>}
     * @required
     */
    items: T[];
};

export type RequestWithBody<B> = Request<{}, {}, B>;
export type RequestWithQueryParams<Q> = Request<{}, {}, {}, Q>;
export type RequestWithParamsAndBody<P, B> = Request<P, {}, B>;
export type RequestWithParamsAndQueries<P, Q> = Request<P, {}, {}, Q>;