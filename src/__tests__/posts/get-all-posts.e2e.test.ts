import { dbHelper, request } from '../test-helpers';
import { HTTP_STATUS_CODES, ROUTES } from '../../constants';
import { posts } from '../dataset';

describe('get all posts', () => {
    beforeAll(async () => {
        await dbHelper.connectToDb();
    });

    beforeEach(async () => {
        await dbHelper.setDb({ posts });
    });

    afterEach(async () => {
        await dbHelper.resetCollections(['posts']);
    });

    afterAll(async () => {
        await dbHelper.dropDb();
        await dbHelper.closeConnection();
    });

    it('gets all posts according to default query parameters', async () => {
        const { body } = await request.get(ROUTES.POSTS).expect(HTTP_STATUS_CODES.OK_200);

        expect(body.totalCount).toBe(8);
        expect(body.pagesCount).toBe(1);
        expect(body.page).toBe(1);
        expect(body.pageSize).toBe(10);
        expect(new Date(body.items[0].createdAt).getTime()).toBeGreaterThanOrEqual(
            new Date(body.items[1].createdAt).getTime()
        );
    });

    it('returns all posts according to requested query parameters', async () => {
        const queryString = `?pageNumber=1&pageSize=1&sortBy=createdAt&sortDirection=asc`;

        const { body } = await request.get(`${ROUTES.POSTS}${queryString}`).expect(HTTP_STATUS_CODES.OK_200);

        expect(body.totalCount).toBe(8);
        expect(body.pagesCount).toBe(8);
        expect(body.page).toBe(1);
        expect(body.pageSize).toBe(1);
        expect(body.items.length).toBe(1);
    });
});
