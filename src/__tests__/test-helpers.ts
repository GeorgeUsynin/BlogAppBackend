import { app } from '../app';
import { agent } from 'supertest';
import { CreateUpdateBlogErrorViewModel } from '../models/blogs';
import { capitalizeFirstLetter } from '../helpers';
import { SETTINGS } from '../app-settings';

export const request = agent(app);

type TProperties = 'isRequired' | 'isString' | 'maxLength';

type TValues = {
    name?: TProperties[];
    description?: TProperties[];
    websiteUrl?: (TProperties | 'isPattern')[];
    title?: TProperties[];
    shortDescription?: TProperties[];
    content?: TProperties[];
    blogId?: (Exclude<TProperties, 'maxLength'> | 'blogIdNotExist')[];
};

const websiteUrlPattern = '^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$';

const errorMessagesConfig = {
    isRequired: (field: string) => ({
        message: `${capitalizeFirstLetter(field)} field is required`,
        field,
    }),
    isString: (field: string) => ({
        message: `${capitalizeFirstLetter(field)} field should be a string`,
        field,
    }),
    maxLength: (field: string, length: number) => ({
        message: `Max length should be ${length} characters`,
        field,
    }),
    isPattern: (field: string) => ({
        message: `${capitalizeFirstLetter(field)} should follow next pattern: ${websiteUrlPattern}`,
        field,
    }),
    blogIdNotExist: (field: string) => ({
        message: `There is no blog existed with provided ${field}`,
        field,
    }),
} as const;

export const createErrorMessages = (values: TValues) => {
    const { name, description, websiteUrl, title, shortDescription, content, blogId } = values;

    const errorsMessages: CreateUpdateBlogErrorViewModel['errorsMessages'] = [];

    if (name) {
        name.forEach(value => {
            switch (value) {
                case 'isRequired':
                    errorsMessages.push(errorMessagesConfig.isRequired('name'));
                case 'isString':
                    errorsMessages.push(errorMessagesConfig.isString('name'));
                case 'maxLength':
                    errorsMessages.push(errorMessagesConfig.maxLength('name', 15));
            }
        });
    }

    if (description) {
        description.forEach(value => {
            switch (value) {
                case 'isRequired':
                    errorsMessages.push(errorMessagesConfig.isRequired('description'));
                case 'isString':
                    errorsMessages.push(errorMessagesConfig.isString('description'));
                case 'maxLength':
                    errorsMessages.push(errorMessagesConfig.maxLength('description', 500));
            }
        });
    }

    if (websiteUrl) {
        websiteUrl.forEach(value => {
            switch (value) {
                case 'isRequired':
                    errorsMessages.push(errorMessagesConfig.isRequired('websiteUrl'));
                case 'isString':
                    errorsMessages.push(errorMessagesConfig.isString('websiteUrl'));
                case 'maxLength':
                    errorsMessages.push(errorMessagesConfig.maxLength('websiteUrl', 100));
                case 'isPattern':
                    errorsMessages.push(errorMessagesConfig.isPattern('websiteUrl'));
            }
        });
    }

    if (title) {
        title.forEach(value => {
            switch (value) {
                case 'isRequired':
                    errorsMessages.push(errorMessagesConfig.isRequired('title'));
                case 'isString':
                    errorsMessages.push(errorMessagesConfig.isString('title'));
                case 'maxLength':
                    errorsMessages.push(errorMessagesConfig.maxLength('title', 30));
            }
        });
    }

    if (shortDescription) {
        shortDescription.forEach(value => {
            switch (value) {
                case 'isRequired':
                    errorsMessages.push(errorMessagesConfig.isRequired('shortDescription'));
                case 'isString':
                    errorsMessages.push(errorMessagesConfig.isString('shortDescription'));
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
                case 'isString':
                    errorsMessages.push(errorMessagesConfig.isString('content'));
                case 'maxLength':
                    errorsMessages.push(errorMessagesConfig.maxLength('content', 1000));
            }
        });
    }

    if (blogId) {
        blogId.forEach(value => {
            switch (value) {
                case 'isRequired':
                    errorsMessages.push(errorMessagesConfig.isRequired('blogId'));
                case 'isString':
                    errorsMessages.push(errorMessagesConfig.isString('blogId'));
                case 'blogIdNotExist':
                    errorsMessages.push(errorMessagesConfig.blogIdNotExist('blogId'));
            }
        });
    }

    return { errorsMessages };
};

export const getAuthorization = () => {
    const buff = Buffer.from(`${SETTINGS.CREDENTIALS.LOGIN}:${SETTINGS.CREDENTIALS.PASSWORD}`, 'utf8');
    const codedAuth = buff.toString('base64');

    return { Authorization: `Basic ${codedAuth}` };
};
