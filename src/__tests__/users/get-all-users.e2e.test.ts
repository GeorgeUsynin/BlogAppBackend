import { dbHelper, getAuthorization, request } from '../test-helpers';
import { HTTP_STATUS_CODES, ROUTES } from '../../constants';
import { users } from '../dataset';

describe('get all users', () => {
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

    it('gets all users according to default query parameters', async () => {
        const { body } = await request.get(ROUTES.USERS).set(getAuthorization()).expect(HTTP_STATUS_CODES.OK_200);

        expect(body.totalCount).toBe(4);
        expect(body.pagesCount).toBe(1);
        expect(body.page).toBe(1);
        expect(body.pageSize).toBe(10);
        expect(new Date(body.items[0].createdAt).getTime()).toBeGreaterThanOrEqual(
            new Date(body.items[1].createdAt).getTime()
        );
    });

    describe('returns all users according to requested query parameters', () => {
        it('searchLoginTerm and searchEmailTerm', async () => {
            const queryString = `?searchLoginTerm=nat&searchEmailTerm=ge&pageNumber=1&pageSize=1&sortBy=createdAt&sortDirection=asc`;

            const { body } = await request
                .get(`${ROUTES.USERS}${queryString}`)
                .set(getAuthorization())
                .expect(HTTP_STATUS_CODES.OK_200);

            expect(body.totalCount).toBe(2);
            expect(body.pagesCount).toBe(2);
            expect(body.page).toBe(1);
            expect(body.pageSize).toBe(1);
            expect(body.items.length).toBe(1);
        });

        // it('searchLoginTerm', async () => {
        //     const queryString = `?searchLoginTerm=nat&pageNumber=1&pageSize=1&sortBy=createdAt&sortDirection=asc`;

        //     const { body } = await request
        //         .get(`${ROUTES.USERS}${queryString}`)
        //         .set(getAuthorization())
        //         .expect(HTTP_STATUS_CODES.OK_200);

        //     expect(body.totalCount).toBe(1);
        //     expect(body.pagesCount).toBe(1);
        //     expect(body.page).toBe(1);
        //     expect(body.pageSize).toBe(1);
        //     expect(body.items.length).toBe(1);
        // });

        // it('searchEmailTerm', async () => {
        //     const queryString = `?searchEmailTerm=ge&pageNumber=1&pageSize=1&sortBy=createdAt&sortDirection=asc`;

        //     const { body } = await request
        //         .get(`${ROUTES.USERS}${queryString}`)
        //         .set(getAuthorization())
        //         .expect(HTTP_STATUS_CODES.OK_200);

        //     expect(body.totalCount).toBe(1);
        //     expect(body.pagesCount).toBe(1);
        //     expect(body.page).toBe(1);
        //     expect(body.pageSize).toBe(1);
        //     expect(body.items.length).toBe(1);
        // });
    });

    it('returns 401 Unauthorized status code if there is no proper Authorization header', async () => {
        await request.get(ROUTES.USERS).expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    });
});
