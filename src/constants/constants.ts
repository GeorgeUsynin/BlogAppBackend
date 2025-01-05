export enum HTTP_STATUS_CODES {
    OK_200 = 200,
    CREATED_201 = 201,
    NO_CONTENT_204 = 204,
    BAD_REQUEST_400 = 400,
    UNAUTHORIZED_401 = 401,
    FORBIDDEN_403 = 403,
    NOT_FOUND_404 = 404,
    INTERNAL_SERVER_ERROR_500 = 500,
    TOO_MANY_REQUEST = 429,
}

export enum ROUTES {
    AUTH = '/auth',
    BLOGS = '/blogs',
    COMMENTS = '/comments',
    DEVICES = '/devices',
    LIKE_STATUS = '/like-status',
    LOGIN = '/login',
    LOGOUT = '/logout',
    ME = '/me',
    NEW_PASSWORD = '/new-password',
    PASSWORD_RECOVERY = '/password-recovery',
    POSTS = '/posts',
    REFRESH_TOKEN = '/refresh-token',
    REGISTRATION = '/registration',
    REGISTRATION_CONFIRMATION = '/registration-confirmation',
    REGISTRATION_EMAIL_RESENDING = '/registration-email-resending',
    SECURITY = '/security',
    TESTING = '/testing/all-data',
    USERS = '/users',
}

export enum ResultStatus {
    BadRequest = 'BadRequest',
    Failure = 'Failure',
    Forbidden = 'Forbidden',
    NotFound = 'NotFound',
    Success = 'Success',
    Unauthorized = 'Unauthorized',
    RateLimit = 'RateLimit',
}

export enum LikeStatus {
    None = 'None',
    Like = 'Like',
    Dislike = 'Dislike',
}
