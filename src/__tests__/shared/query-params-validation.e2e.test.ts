import { HTTP_STATUS_CODES, ROUTES } from '../../constants';
import { blogs, posts, users } from '../dataset';
import { createErrorMessages, request, getAuthorization, getBearerAuthorization, dbHelper } from '../test-helpers';

const secondBlogId = blogs[1]._id.toString();
const secondPostId = posts[1]._id.toString();

const URLS = [
    { url: `${ROUTES.BLOGS}`, from: 'blogs' },
    { url: `${ROUTES.POSTS}`, from: 'posts' },
    { url: `${ROUTES.BLOGS}/${secondBlogId}${ROUTES.POSTS}`, from: 'posts' },
    { url: `${ROUTES.POSTS}/${secondPostId}${ROUTES.COMMENTS}`, from: 'comments' },
    { url: `${ROUTES.USERS}`, from: 'users' },
] as const;

const secondUser = users[1];

const setAuthorization = (from: 'users' | 'comments' | 'posts' | 'blogs') => {
    if (from === 'comments') {
        return getBearerAuthorization(secondUser._id.toString());
    }
    if (from === 'users') {
        return getAuthorization();
    }
    return {};
};

beforeAll(async () => {
    await dbHelper.connectToDb();
});

beforeEach(async () => {
    await dbHelper.setDb({ users });
});

afterEach(async () => {
    await dbHelper.resetCollections(['users']);
});

afterAll(async () => {
    await dbHelper.dropDb();
    await dbHelper.closeConnection();
});

URLS.forEach(item => {
    const { url, from } = item;

    return describe('query params validation', () => {
        describe('pageNumber', () => {
            it('returns 400 status code and proper error object if `pageNumber` is not a positive number', async () => {
                const pageNumberQueryString = '?pageNumber=error';

                const { body } = await request
                    .get(`${url}${pageNumberQueryString}`)
                    .set(setAuthorization(from))
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ pageNumber: ['isPositiveNumber'] })).toEqual(body);
            });
        });

        describe('pageSize', () => {
            it('returns 400 status code and proper error object if `pageSize` is not a positive number', async () => {
                const pageSizeQueryString = '?pageSize=error';

                const { body } = await request
                    .get(`${url}${pageSizeQueryString}`)
                    .set(setAuthorization(from))
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ pageSize: ['isPositiveNumber'] })).toEqual(body);
            });
        });

        describe('sortBy', () => {
            it('returns 400 status code and proper error object if `sortBy` is not equal to allowed sorting values', async () => {
                const sortByQueryString = '?sortBy=error';

                const { body } = await request
                    .get(`${url}${sortByQueryString}`)
                    .set(setAuthorization(from))
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ sortBy: { condition: ['isEqualTo'], from } })).toEqual(body);
            });
        });

        describe('sortDirection', () => {
            it('returns 400 status code and proper error object if `sortDirection` is not equal to one of the following values: `asc`, `desc`', async () => {
                const sortDirectionQueryString = '?sortDirection=error';

                const { body } = await request
                    .get(`${url}${sortDirectionQueryString}`)
                    .set(setAuthorization(from))
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ sortDirection: ['isEqualTo'] })).toEqual(body);
            });
        });
    });
});
