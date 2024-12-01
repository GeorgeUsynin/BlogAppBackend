import { HTTP_STATUS_CODES, ROUTES } from '../../constants';
import { blogs } from '../dataset';
import { createErrorMessages, request, getAuthorization } from '../test-helpers';

const secondBlogId = blogs[1]._id.toString();
const URLS = [
    { url: `${ROUTES.BLOGS}`, from: 'blogs' },
    { url: `${ROUTES.POSTS}`, from: 'posts' },
    { url: `${ROUTES.BLOGS}/${secondBlogId}${ROUTES.POSTS}`, from: 'posts' },
    { url: `${ROUTES.USERS}`, from: 'users' },
] as const;

URLS.forEach(item => {
    const { url, from } = item;

    return describe('query params validation', () => {
        describe('pageNumber', () => {
            it('returns 400 status code and proper error object if `pageNumber` is not a positive number', async () => {
                const pageNumberQueryString = '?pageNumber=error';

                const { body } = await request
                    .get(`${url}${pageNumberQueryString}`)
                    .set(from === 'users' ? getAuthorization() : {})
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ pageNumber: ['isPositiveNumber'] })).toEqual(body);
            });
        });

        describe('pageSize', () => {
            it('returns 400 status code and proper error object if `pageSize` is not a positive number', async () => {
                const pageSizeQueryString = '?pageSize=error';

                const { body } = await request
                    .get(`${url}${pageSizeQueryString}`)
                    .set(from === 'users' ? getAuthorization() : {})
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ pageSize: ['isPositiveNumber'] })).toEqual(body);
            });
        });

        describe('sortBy', () => {
            it('returns 400 status code and proper error object if `sortBy` is not equal to allowed sorting values', async () => {
                const sortByQueryString = '?sortBy=error';

                const { body } = await request
                    .get(`${url}${sortByQueryString}`)
                    .set(from === 'users' ? getAuthorization() : {})
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ sortBy: { condition: ['isEqualTo'], from } })).toEqual(body);
            });
        });

        describe('sortDirection', () => {
            it('returns 400 status code and proper error object if `sortDirection` is not equal to one of the following values: `asc`, `desc`', async () => {
                const sortDirectionQueryString = '?sortDirection=error';

                const { body } = await request
                    .get(`${url}${sortDirectionQueryString}`)
                    .set(from === 'users' ? getAuthorization() : {})
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ sortDirection: ['isEqualTo'] })).toEqual(body);
            });
        });
    });
});
