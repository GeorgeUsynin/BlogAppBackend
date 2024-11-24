import { dbHelper, request } from '../test-helpers';
import { HTTP_STATUS_CODES, ROUTES } from '../../constants';
import { blogs } from '../dataset';

describe('get all blogs', () => {
    beforeAll(async () => {
        await dbHelper.connectToDb();
    });

    beforeEach(async () => {
        await dbHelper.setDb({ blogs, posts: [] });
    });

    afterEach(async () => {
        await dbHelper.resetCollections(['blogs']);
    });

    afterAll(async () => {
        await dbHelper.dropDb();
        await dbHelper.closeConnection();
    });

    it('gets all blogs according to default query parameters', async () => {
        const { body } = await request.get(ROUTES.BLOGS).expect(HTTP_STATUS_CODES.OK_200);

        expect(body.totalCount).toBe(4);
        expect(body.pagesCount).toBe(1);
        expect(body.page).toBe(1);
        expect(body.pageSize).toBe(10);
        expect(body.items[0].createdAt).toBeGreaterThanOrEqual(body.items[1].createdAt);
    });

    it('returns all blogs according to requested query parameters', async () => {
        const queryString = `?searchNameTerm=es&pageNumber=1&pageSize=1&sortBy=createdAt&sortDirection=asc`;

        const { body } = await request.get(`${ROUTES.BLOGS}${queryString}`).expect(HTTP_STATUS_CODES.OK_200);

        expect(body.totalCount).toBe(2);
        expect(body.pagesCount).toBe(1);
        expect(body.page).toBe(1);
        expect(body.pageSize).toBe(1);
        expect(body.items.length).toBe(1);
    });

    describe('returns default values for blogs requested with bad query parameters', () => {
        it('returns default `pageNumber` if `pageNumber` query parameter is bad', async () => {
            const pageNumberQueryString = '?pageNumber=error';
            const defaultPageNumber = 1;

            const { body } = await request
                .get(`${ROUTES.BLOGS}${pageNumberQueryString}`)
                .expect(HTTP_STATUS_CODES.OK_200);

            expect(body.page).toBe(defaultPageNumber);
        });

        it('returns default `pageSize` if `pageSize` query parameter is bad', async () => {
            const pageSizeQueryString = '?pageSize=error';
            const defaultPageSize = 10;

            const { body } = await request
                .get(`${ROUTES.BLOGS}${pageSizeQueryString}`)
                .expect(HTTP_STATUS_CODES.OK_200);

            expect(body.pageSize).toBe(defaultPageSize);
        });

        it('returns blogs sorted by `createdAt` field if `sortBy` query parameter is bad', async () => {
            const sortByQueryString = '?sortBy=error';

            const { body } = await request.get(`${ROUTES.BLOGS}${sortByQueryString}`).expect(HTTP_STATUS_CODES.OK_200);

            expect(body.totalCount).toBe(4);
        });

        it('returns blogs sorted in descending order if `sortDirection` query parameter is bad', async () => {
            const sortDirectionQueryString = '?sortDirection=error';

            const { body } = await request
                .get(`${ROUTES.BLOGS}${sortDirectionQueryString}`)
                .expect(HTTP_STATUS_CODES.OK_200);

            expect(body.totalCount).toBe(4);
            expect(body.items[0].createdAt).toBeGreaterThanOrEqual(body.items[1].createdAt);
        });

        it('returns all blogs with default parameters if `searchNameTerm` query parameter was not founded', async () => {
            const searchNameTermQueryString = '?searchNameTerm=abracadabra';

            const { body } = await request
                .get(`${ROUTES.BLOGS}${searchNameTermQueryString}`)
                .expect(HTTP_STATUS_CODES.OK_200);

            expect(body.totalCount).toBe(4);
            expect(body.pagesCount).toBe(1);
            expect(body.page).toBe(1);
            expect(body.pageSize).toBe(10);
            expect(body.items[0].createdAt).toBeGreaterThanOrEqual(body.items[1].createdAt);
        });
    });
});
