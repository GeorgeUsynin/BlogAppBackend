import { app } from '../app';
import { agent } from 'supertest';
import { CreateUpdateBlogErrorViewModel } from '../models/blogs';
import { capitalizeFirstLetter } from '../helpers';
import { SETTINGS } from '../app-settings';

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
};

const errorMessagesConfig = {
    isRequired: (field: string) => ({
        message: `${capitalizeFirstLetter(field)} field is required`,
        field,
    }),
    isString: (field: string) => ({
        message: `${capitalizeFirstLetter(field)} field should be a string`,
        field,
    }),
    isEmptyString: (field: string) => ({
        message: `${capitalizeFirstLetter(field)} field should not be empty or contain only spaces`,
        field,
    }),
    maxLength: (field: string, length: number) => ({
        message: `Max length should be ${length} characters`,
        field,
    }),
    isPattern: (field: string) => ({
        message: `${capitalizeFirstLetter(field)} should match the specified URL pattern`,
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
                    errorsMessages.push(errorMessagesConfig.isPattern('websiteUrl'));
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

    return { errorsMessages };
};

export const getAuthorization = () => ({ Authorization: `Basic ${SETTINGS.CODE_AUTH_BASE64}` });
