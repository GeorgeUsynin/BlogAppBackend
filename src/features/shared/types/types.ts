import type { Request } from 'express';

export type RequestWithBody<B> = Request<{}, {}, B>;
export type RequestWithQueryParams<Q> = Request<{}, {}, {}, Q>;
export type RequestWithParamsAndBody<P, B> = Request<P, {}, B>;
export type RequestWithParamsAndQueries<P, Q> = Request<P, {}, {}, Q>;
