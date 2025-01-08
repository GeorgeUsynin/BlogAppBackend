import { Mongoose } from 'mongoose';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { app } from '../app';
import { agent } from 'supertest';
import { ErrorViewModel } from '../features/shared/types';
import { capitalizeFirstLetter } from '../helpers';
import { SETTINGS } from '../app-settings';
import { connectToDatabase } from '../database';
import { BlogModel, TBlog } from '../features/blogs/domain';
import { PostModel, TPost } from '../features/posts/domain';
import { CommentModel, TComment } from '../features/comments/domain';
import { TUser, UserModel } from '../features/users/domain';
import { AuthDeviceSessionModel, TDevice } from '../features/security/domain';
import { ApiRateLimitModel, TAPIRateLimit } from '../features/apiRateLimit/domain';
import { LikeStatus } from '../constants';
import { LikeModel, TLike } from '../features/likes/domain';

export const request = agent(app);

type TProperties = 'isRequired' | 'isString' | 'isEmptyString' | 'maxLength';

type TValues = {
    name?: TProperties[];
    description?: TProperties[];
    websiteUrl?: (TProperties | 'isPattern')[];
    title?: TProperties[];
    shortDescription?: TProperties[];
    content?: (TProperties | 'minMaxLength')[];
    blogId?: (Exclude<TProperties, 'maxLength'> | 'blogIdNotExist')[];
    pageNumber?: 'isPositiveNumber'[];
    pageSize?: 'isPositiveNumber'[];
    sortBy?: {
        condition: 'isEqualTo'[];
        from: 'blogs' | 'posts' | 'comments' | 'users';
    };
    sortDirection?: 'isEqualTo'[];
    login?: (Omit<TProperties, 'maxLength'> | 'minMaxLength' | 'isPattern' | 'isUnique')[];
    email?: (Omit<TProperties, 'maxLength'> | 'isPattern')[];
    password?: (Omit<TProperties, 'maxLength'> | 'minMaxLength')[];
    newPassword?: (Omit<TProperties, 'maxLength'> | 'minMaxLength')[];
    loginOrEmail?: Omit<TProperties, 'maxLength'>[];
    code?: Omit<TProperties, 'maxLength'>[];
    recoveryCode?: Omit<TProperties, 'maxLength'>[];
    from?: 'blogs' | 'posts' | 'comments' | 'users';
    likeStatus?: (Omit<TProperties, 'maxLength'> | 'isEqualTo')[];
};

const config = {
    blogs: ['name', 'createdAt'],
    posts: ['title', 'blogName', 'createdAt'],
    comments: ['createdAt'],
    users: ['login', 'email', 'createdAt'],
    likes: [LikeStatus.None, LikeStatus.Like, LikeStatus.Dislike],
};

const errorMessagesConfig = {
    isRequired: (field: string) => ({
        message: `${capitalizeFirstLetter(field)} field is required`,
        field,
    }),
    isPositiveNumber: (field: string) => ({
        message: `${capitalizeFirstLetter(field)} field should be a positive number`,
        field,
    }),
    isString: (field: string) => ({
        message: `${capitalizeFirstLetter(field)} field should be a string`,
        field,
    }),
    //@ts-expect-error
    isEqualTo: (field: string, from?: 'blogs' | 'posts' | 'comments' | 'users' | 'likes') => {
        switch (field) {
            case 'sortBy':
                return {
                    message: `${capitalizeFirstLetter(
                        field
                    )} field should be equal one of the following values: ${config[from || 'blogs'].join(', ')}`,
                    field,
                };
            case 'sortDirection':
                return {
                    message: `${capitalizeFirstLetter(
                        field
                    )} field should be equal one of the following values: asc, desc`,
                    field,
                };
            case 'likeStatus':
                return {
                    message: `${capitalizeFirstLetter(
                        field
                    )} field should be equal one of the following values: ${config['likes'].join(', ')}`,
                    field,
                };
        }
    },
    isEmptyString: (field: string) => ({
        message: `${capitalizeFirstLetter(field)} field should not be empty or contain only spaces`,
        field,
    }),
    maxLength: (field: string, length: number) => ({
        message: `Max length should be ${length} characters`,
        field,
    }),
    minMaxLength: (field: string, minLength: number, maxLength: number) => ({
        message: `${capitalizeFirstLetter(field)} length should be from ${minLength} to ${maxLength} characters`,
        field,
    }),
    isPattern: (field: string, pattern: string) => ({
        message: `${capitalizeFirstLetter(field)} should match the specified ${pattern} pattern`,
        field,
    }),
    blogIdNotExist: (field: string) => ({
        message: `There is no blog existed with provided ${field}`,
        field,
    }),
    isUnique: (field: string) => ({
        message: 'User with this login or email already exists',
        field,
    }),
} as const;

export const createErrorMessages = (values: TValues) => {
    const {
        name,
        description,
        websiteUrl,
        title,
        shortDescription,
        content,
        blogId,
        pageNumber,
        pageSize,
        sortBy,
        sortDirection,
        login,
        email,
        password,
        loginOrEmail,
        from,
        code,
        newPassword,
        recoveryCode,
        likeStatus,
    } = values;

    const errorsMessages: ErrorViewModel['errorsMessages'] = [];

    if (name) {
        name.forEach(value => {
            switch (value) {
                case 'isRequired':
                    errorsMessages.push(errorMessagesConfig.isRequired('name'));
                    break;
                case 'isString':
                    errorsMessages.push(errorMessagesConfig.isString('name'));
                    break;
                case 'isEmptyString':
                    errorsMessages.push(errorMessagesConfig.isEmptyString('name'));
                    break;
                case 'maxLength':
                    errorsMessages.push(errorMessagesConfig.maxLength('name', 15));
                    break;
            }
        });
    }

    if (description) {
        description.forEach(value => {
            switch (value) {
                case 'isRequired':
                    errorsMessages.push(errorMessagesConfig.isRequired('description'));
                    break;
                case 'isString':
                    errorsMessages.push(errorMessagesConfig.isString('description'));
                    break;
                case 'isEmptyString':
                    errorsMessages.push(errorMessagesConfig.isEmptyString('description'));
                    break;
                case 'maxLength':
                    errorsMessages.push(errorMessagesConfig.maxLength('description', 500));
                    break;
            }
        });
    }

    if (websiteUrl) {
        websiteUrl.forEach(value => {
            switch (value) {
                case 'isRequired':
                    errorsMessages.push(errorMessagesConfig.isRequired('websiteUrl'));
                    break;
                case 'isString':
                    errorsMessages.push(errorMessagesConfig.isString('websiteUrl'));
                    break;
                case 'isEmptyString':
                    errorsMessages.push(errorMessagesConfig.isEmptyString('websiteUrl'));
                    break;
                case 'maxLength':
                    errorsMessages.push(errorMessagesConfig.maxLength('websiteUrl', 100));
                    break;
                case 'isPattern':
                    errorsMessages.push(
                        errorMessagesConfig.isPattern(
                            'websiteUrl',
                            '^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$'
                        )
                    );
                    break;
            }
        });
    }

    if (title) {
        title.forEach(value => {
            switch (value) {
                case 'isRequired':
                    errorsMessages.push(errorMessagesConfig.isRequired('title'));
                    break;
                case 'isString':
                    errorsMessages.push(errorMessagesConfig.isString('title'));
                    break;
                case 'isEmptyString':
                    errorsMessages.push(errorMessagesConfig.isEmptyString('title'));
                    break;
                case 'maxLength':
                    errorsMessages.push(errorMessagesConfig.maxLength('title', 30));
                    break;
            }
        });
    }

    if (shortDescription) {
        shortDescription.forEach(value => {
            switch (value) {
                case 'isRequired':
                    errorsMessages.push(errorMessagesConfig.isRequired('shortDescription'));
                    break;
                case 'isString':
                    errorsMessages.push(errorMessagesConfig.isString('shortDescription'));
                    break;
                case 'isEmptyString':
                    errorsMessages.push(errorMessagesConfig.isEmptyString('shortDescription'));
                    break;
                case 'maxLength':
                    errorsMessages.push(errorMessagesConfig.maxLength('shortDescription', 100));
            }
        });
    }

    if (content) {
        content.forEach(value => {
            switch (value) {
                case 'isRequired':
                    errorsMessages.push(errorMessagesConfig.isRequired('content'));
                    break;
                case 'isString':
                    errorsMessages.push(errorMessagesConfig.isString('content'));
                    break;
                case 'isEmptyString':
                    errorsMessages.push(errorMessagesConfig.isEmptyString('content'));
                    break;
                case 'maxLength':
                    errorsMessages.push(errorMessagesConfig.maxLength('content', from === 'posts' ? 1000 : 300));
                    break;
                case 'minMaxLength':
                    errorsMessages.push(errorMessagesConfig.minMaxLength('content', 20, 300));
                    break;
            }
        });
    }

    if (blogId) {
        blogId.forEach(value => {
            switch (value) {
                case 'isRequired':
                    errorsMessages.push(errorMessagesConfig.isRequired('blogId'));
                    break;
                case 'isString':
                    errorsMessages.push(errorMessagesConfig.isString('blogId'));
                    break;
                case 'isEmptyString':
                    errorsMessages.push(errorMessagesConfig.isEmptyString('blogId'));
                    break;
                case 'blogIdNotExist':
                    errorsMessages.push(errorMessagesConfig.blogIdNotExist('blogId'));
                    break;
            }
        });
    }

    if (pageNumber) {
        pageNumber.forEach(value => {
            if (value === 'isPositiveNumber') {
                errorsMessages.push(errorMessagesConfig.isPositiveNumber('pageNumber'));
            }
        });
    }

    if (pageSize) {
        pageSize.forEach(value => {
            if (value === 'isPositiveNumber') {
                errorsMessages.push(errorMessagesConfig.isPositiveNumber('pageSize'));
            }
        });
    }

    if (sortBy) {
        sortBy.condition.forEach(value => {
            if (value === 'isEqualTo') {
                const error = errorMessagesConfig.isEqualTo('sortBy', sortBy.from);
                if (error) errorsMessages.push(error);
            }
        });
    }

    if (sortDirection) {
        sortDirection.forEach(value => {
            if (value === 'isEqualTo') {
                const error = errorMessagesConfig.isEqualTo('sortDirection');
                if (error) errorsMessages.push(error);
            }
        });
    }

    if (login) {
        login.forEach(value => {
            switch (value) {
                case 'isRequired':
                    errorsMessages.push(errorMessagesConfig.isRequired('login'));
                    break;
                case 'isEmptyString':
                    errorsMessages.push(errorMessagesConfig.isEmptyString('login'));
                    break;
                case 'isString':
                    errorsMessages.push(errorMessagesConfig.isString('login'));
                    break;
                case 'minMaxLength':
                    errorsMessages.push(errorMessagesConfig.minMaxLength('login', 3, 10));
                    break;
                case 'isPattern':
                    errorsMessages.push(errorMessagesConfig.isPattern('login', '^[a-zA-Z0-9_-]*$'));
                    break;
                case 'isUnique':
                    errorsMessages.push(errorMessagesConfig.isUnique(''));
                    break;
            }
        });
    }

    if (email) {
        email.forEach(value => {
            switch (value) {
                case 'isRequired':
                    errorsMessages.push(errorMessagesConfig.isRequired('email'));
                    break;
                case 'isEmptyString':
                    errorsMessages.push(errorMessagesConfig.isEmptyString('email'));
                    break;
                case 'isString':
                    errorsMessages.push(errorMessagesConfig.isString('email'));
                    break;
                case 'isPattern':
                    errorsMessages.push(errorMessagesConfig.isPattern('email', '^[w-.]+@([w-]+.)+[w-]{2,4}$'));
                    break;
                case 'isUnique':
                    errorsMessages.push(errorMessagesConfig.isUnique(''));
                    break;
            }
        });
    }

    if (password) {
        password.forEach(value => {
            switch (value) {
                case 'isRequired':
                    errorsMessages.push(errorMessagesConfig.isRequired('password'));
                    break;
                case 'isEmptyString':
                    errorsMessages.push(errorMessagesConfig.isEmptyString('password'));
                    break;
                case 'isString':
                    errorsMessages.push(errorMessagesConfig.isString('password'));
                    break;
                case 'minMaxLength':
                    errorsMessages.push(errorMessagesConfig.minMaxLength('password', 6, 20));
                    break;
            }
        });
    }

    if (loginOrEmail) {
        loginOrEmail.forEach(value => {
            switch (value) {
                case 'isRequired':
                    errorsMessages.push(errorMessagesConfig.isRequired('loginOrEmail'));
                    break;
                case 'isEmptyString':
                    errorsMessages.push(errorMessagesConfig.isEmptyString('loginOrEmail'));
                    break;
                case 'isString':
                    errorsMessages.push(errorMessagesConfig.isString('loginOrEmail'));
                    break;
            }
        });
    }

    if (code) {
        code.forEach(value => {
            switch (value) {
                case 'isRequired':
                    errorsMessages.push(errorMessagesConfig.isRequired('code'));
                    break;
                case 'isString':
                    errorsMessages.push(errorMessagesConfig.isString('code'));
                    break;
                case 'isEmptyString':
                    errorsMessages.push(errorMessagesConfig.isEmptyString('code'));
                    break;
            }
        });
    }

    if (newPassword) {
        newPassword.forEach(value => {
            switch (value) {
                case 'isRequired':
                    errorsMessages.push(errorMessagesConfig.isRequired('newPassword'));
                    break;
                case 'isEmptyString':
                    errorsMessages.push(errorMessagesConfig.isEmptyString('newPassword'));
                    break;
                case 'isString':
                    errorsMessages.push(errorMessagesConfig.isString('newPassword'));
                    break;
                case 'minMaxLength':
                    errorsMessages.push(errorMessagesConfig.minMaxLength('newPassword', 6, 20));
                    break;
            }
        });
    }

    if (recoveryCode) {
        recoveryCode.forEach(value => {
            switch (value) {
                case 'isRequired':
                    errorsMessages.push(errorMessagesConfig.isRequired('recoveryCode'));
                    break;
                case 'isString':
                    errorsMessages.push(errorMessagesConfig.isString('recoveryCode'));
                    break;
                case 'isEmptyString':
                    errorsMessages.push(errorMessagesConfig.isEmptyString('recoveryCode'));
                    break;
            }
        });
    }

    if (likeStatus) {
        likeStatus.forEach(value => {
            switch (value) {
                case 'isRequired':
                    errorsMessages.push(errorMessagesConfig.isRequired('likeStatus'));
                    break;
                case 'isEmptyString':
                    errorsMessages.push(errorMessagesConfig.isEmptyString('likeStatus'));
                    break;
                case 'isString':
                    errorsMessages.push(errorMessagesConfig.isString('likeStatus'));
                    break;
                case 'isEqualTo':
                    const error = errorMessagesConfig.isEqualTo('likeStatus');
                    if (error) errorsMessages.push(error);
                    break;
            }
        });
    }

    return { errorsMessages };
};

export const getAuthorization = () => ({ Authorization: `Basic ${SETTINGS.CODE_AUTH_BASE64}` });

export const generateToken = (payload: TPayload, expiresIn: string | number) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn });
    return token;
};

export const getBearerAuthorization = (userId: string) => {
    const token = generateToken({ userId }, '7d');
    return { Authorization: `Bearer ${token}` };
};

type TPayload = {
    userId?: string;
    deviceId?: string;
};

export const generateRefreshTokenCookie = (payload: TPayload, expiresIn: string | number) => {
    return { Cookie: [`refreshToken=${generateToken(payload, expiresIn)}; Path=/; HttpOnly; Secure`] };
};

type TDataset = {
    blogs?: TBlog[];
    posts?: TPost[];
    users?: TUser[];
    comments?: TComment[];
    apiRateLimit?: TAPIRateLimit[];
    authDeviceSessions?: TDevice[];
    likes?: TLike[];
};

let mongooseConnection: Mongoose | null = null;

export const dbHelper = {
    connectToDb: async () => {
        const { connection } = await connectToDatabase(SETTINGS.MONGO_URL as string, 'guilds_test');
        mongooseConnection = connection;
    },
    closeConnection: async () => {
        await mongooseConnection?.disconnect();
    },
    resetCollections: async (collectionNames: (keyof TDataset)[]) => {
        if (collectionNames.includes('blogs')) {
            await BlogModel.deleteMany({});
        }
        if (collectionNames.includes('posts')) {
            await PostModel.deleteMany({});
        }
        if (collectionNames.includes('comments')) {
            await CommentModel.deleteMany({});
        }
        if (collectionNames.includes('users')) {
            await UserModel.deleteMany({});
        }
        if (collectionNames.includes('apiRateLimit')) {
            await ApiRateLimitModel.deleteMany({});
        }
        if (collectionNames.includes('authDeviceSessions')) {
            await AuthDeviceSessionModel.deleteMany({});
        }
        if (collectionNames.includes('likes')) {
            await LikeModel.deleteMany({});
        }
    },
    setDb: async (dataset: TDataset) => {
        if (dataset.users?.length) {
            await UserModel.insertMany(dataset.users);
        }

        if (dataset.blogs?.length) {
            await BlogModel.insertMany(dataset.blogs);
        }

        if (dataset.posts?.length) {
            await PostModel.insertMany(dataset.posts);
        }

        if (dataset.comments?.length) {
            await CommentModel.insertMany(dataset.comments);
        }

        if (dataset.authDeviceSessions?.length) {
            await AuthDeviceSessionModel.insertMany(dataset.authDeviceSessions);
        }
    },
    dropDb: async () => {
        await mongooseConnection?.connection.db?.dropDatabase();
    },
    getBlog: async (arrayIndex: number) => {
        const allBlogs = await BlogModel.find({}).lean();
        return allBlogs[arrayIndex];
    },
    getPost: async (arrayIndex: number) => {
        const allPosts = await PostModel.find({}).lean();
        return allPosts[arrayIndex];
    },
    getUser: async (arrayIndex: number) => {
        const allUsers = await UserModel.find({}).lean();
        return allUsers[arrayIndex];
    },
    getComment: async (arrayIndex: number) => {
        const allComments = await CommentModel.find({}).lean();
        return allComments[arrayIndex];
    },
};

export const generateUUID = () => randomUUID();

export const delay = async (ms: number) => {
    return new Promise((res, rej) => {
        setTimeout(() => res({}), ms);
    });
};
