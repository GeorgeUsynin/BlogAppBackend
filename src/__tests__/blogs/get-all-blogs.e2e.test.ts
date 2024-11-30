import { dbHelper, request } from '../test-helpers';
import { HTTP_STATUS_CODES, ROUTES } from '../../constants';
import { blogs } from '../dataset';

describe('get all blogs', () => {
    beforeAll(async () => {
        await dbHelper.connectToDb();
    });

    beforeEach(async () => {
        await dbHelper.setDb({ blogs });
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
        expect(new Date(body.items[0].createdAt).getTime()).toBeGreaterThanOrEqual(
            new Date(body.items[1].createdAt).getTime()
        );
    });

    it('returns all blogs according to requested query parameters', async () => {
        const queryString = `?searchNameTerm=es&pageNumber=1&pageSize=1&sortBy=createdAt&sortDirection=asc`;

        const { body } = await request.get(`${ROUTES.BLOGS}${queryString}`).expect(HTTP_STATUS_CODES.OK_200);

        expect(body.totalCount).toBe(2);
        expect(body.pagesCount).toBe(2);
        expect(body.page).toBe(1);
        expect(body.pageSize).toBe(1);
        expect(body.items.length).toBe(1);
    });
});
