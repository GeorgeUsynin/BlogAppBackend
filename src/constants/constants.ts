export enum HTTP_STATUS_CODES {
    OK_200 = 200,
    CREATED_201 = 201,
    NO_CONTENT_204 = 204,
    BAD_REQUEST_400 = 400,
    UNAUTHORIZED_401 = 401,
    FORBIDDEN_403 = 403,
    NOT_FOUND_404 = 404,
    INTERNAL_SERVER_ERROR_500 = 500,
}

export enum ROUTES {
    AUTH = '/auth',
    LOGIN = '/login',
    ME = '/me',
    BLOGS = '/blogs',
    POSTS = '/posts',
    COMMENTS = '/comments',
    USERS = '/users',
    TESTING = '/testing/all-data',
}

export enum ResultStatus {
    Success = 'Success',
    NotFound = 'NotFound',
    Forbidden = 'Forbidden',
    Unauthorized = 'Unauthorized',
    BadRequest = 'BadRequest',
}
