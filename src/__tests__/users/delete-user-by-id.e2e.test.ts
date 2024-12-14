import { request, getAuthorization, dbHelper } from '../test-helpers';
import { HTTP_STATUS_CODES, ROUTES } from '../../constants';
import { users, fakeRequestedObjectId } from '../dataset';

describe('delete blog by id', () => {
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

    it('deletes user from database by providing ID', async () => {
        const secondUserId = (await dbHelper.getUser(1))._id.toString();

        await request
            .delete(`${ROUTES.USERS}/${secondUserId}`)
            .set(getAuthorization())
            .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

        //checking that the blog was deleted
        await request
            .get(`${ROUTES.USERS}/${secondUserId}`)
            .set(getAuthorization())
            .expect(HTTP_STATUS_CODES.NOT_FOUND_404);

        const { body } = await request.get(ROUTES.USERS).set(getAuthorization()).expect(HTTP_STATUS_CODES.OK_200);
        expect(body.totalCount).toBe(5);
    });

    it('returns 404 status code if the user was not founded by requested ID', async () => {
        await request
            .delete(`${ROUTES.USERS}/${fakeRequestedObjectId}`)
            .set(getAuthorization())
            .expect(HTTP_STATUS_CODES.NOT_FOUND_404);
    });

    it('returns 401 Unauthorized status code if there is no proper Authorization header', async () => {
        const secondUserId = (await dbHelper.getUser(1))._id.toString();

        await request.delete(`${ROUTES.USERS}/${secondUserId}`).expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    });
});
