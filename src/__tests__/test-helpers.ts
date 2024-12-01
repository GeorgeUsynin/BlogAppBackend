import { app } from '../app';
import { agent } from 'supertest';
import { ErrorViewModel } from '../features/shared/types';
import { capitalizeFirstLetter } from '../helpers';
import { SETTINGS } from '../app-settings';
import {
    TDatabase,
    blogsCollection,
    postsCollection,
    connectToDatabase,
    client,
    db,
    usersCollection,
} from '../database/mongoDB';
import bcrypt from 'bcrypt';

export const request = agent(app);

type TProperties = 'isRequired' | 'isString' | 'isEmptyString' | 'maxLength';

type TValues = {
    name?: TProperties[];
    description?: TProperties[];
    websiteUrl?: (TProperties | 'isPattern')[];
    title?: TProperties[];
    shortDescription?: TProperties[];
    content?: TProperties[];
    blogId?: (Exclude<TProperties, 'maxLength'> | 'blogIdNotExist')[];
    pageNumber?: 'isPositiveNumber'[];
    pageSize?: 'isPositiveNumber'[];
    sortBy?: {
        condition: 'isEqualTo'[];
        from: 'blogs' | 'posts' | 'users';
    };
    sortDirection?: 'isEqualTo'[];
    login?: (Omit<TProperties, 'maxLength'> | 'minMaxLength' | 'isPattern' | 'isUnique')[];
    email?: (Omit<TProperties, 'maxLength'> | 'isPattern')[];
    password?: (Omit<TProperties, 'maxLength'> | 'minMaxLength')[];
    loginOrEmail?: Omit<TProperties, 'maxLength'>[];
};

const sortByConfig = {
    blogs: ['name', 'createdAt'],
    posts: ['title', 'blogName', 'createdAt'],
    users: ['login', 'email', 'createdAt'],
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
    isEqualTo: (field: string, from?: 'blogs' | 'posts' | 'users') => {
        switch (field) {
            case 'sortBy':
                return {
                    message: `${capitalizeFirstLetter(
                        field
                    )} field should be equal one of the following values: ${sortByConfig[from || 'blogs'].join(', ')}`,
                    field,
                };
            case 'sortDirection':
                return {
                    message: `${capitalizeFirstLetter(
                        field
                    )} field should be equal one of the following values: asc, desc`,
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
                    errorsMessages.push(errorMessagesConfig.maxLength('content', 1000));
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

    return { errorsMessages };
};

export const getAuthorization = () => ({ Authorization: `Basic ${SETTINGS.CODE_AUTH_BASE64}` });

export const decryptPassword = async (password: string, salt: string) => await bcrypt.hash(password, salt);

type TDataset = {
    blogs?: TDatabase.TBlog[];
    posts?: TDatabase.TPost[];
    users?: TDatabase.TUser[];
};

export const dbHelper = {
    connectToDb: async () => {
        await connectToDatabase(SETTINGS.MONGO_URL as string, 'guilds_test');
    },
    closeConnection: async () => {
        await client.close();
    },
    resetCollections: async (collectionNames: (keyof TDataset)[]) => {
        if (collectionNames.includes('blogs')) {
            await blogsCollection.deleteMany({});
        }
        if (collectionNames.includes('posts')) {
            await postsCollection.deleteMany({});
        }
        if (collectionNames.includes('users')) {
            await usersCollection.deleteMany({});
        }
    },
    setDb: async (dataset: TDataset) => {
        if (dataset.users?.length) {
            await usersCollection.insertMany(dataset.users);
        }

        if (dataset.blogs?.length) {
            await blogsCollection.insertMany(dataset.blogs);
        }

        if (dataset.posts?.length) {
            const blogs = await blogsCollection.find({}).toArray();

            const postsWithBlogId = dataset.posts.map(post => {
                const blogName = post.blogName;
                const blogId = blogs.find(blog => blog.name === blogName)?._id;
                return { ...post, blogId: blogId?.toString() as string };
            });

            await postsCollection.insertMany(postsWithBlogId);
        }
    },
    dropDb: async () => {
        await db.dropDatabase();
    },
    getBlog: async (arrayIndex: number) => {
        const allBlogs = await blogsCollection.find({}).toArray();
        return allBlogs[arrayIndex];
    },
    getPost: async (arrayIndex: number) => {
        const allPosts = await postsCollection.find({}).toArray();
        return allPosts[arrayIndex];
    },
    getUser: async (arrayIndex: number) => {
        const allUsers = await usersCollection.find({}).toArray();
        return allUsers[arrayIndex];
    },
};
