import type { Request } from 'express';

// Request types
export type RequestWithBody<B> = Request<{}, {}, B>;
export type RequestWithParamsAndBody<P, B> = Request<P, {}, B>;
export type RequestWithParamsAndQueries<P, Q> = Request<P, {}, {}, Q>;
