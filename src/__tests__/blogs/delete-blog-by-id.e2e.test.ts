import { request, getAuthorization, dbHelper } from '../test-helpers';
import { HTTP_STATUS_CODES, ROUTES } from '../../constants';
import { blogs, fakeRequestedObjectId } from '../dataset';

describe('delete blog by id', () => {
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

    it('deletes blog from database by providing ID', async () => {
        const secondBlogId = await dbHelper.getSecondBlogId();

        await request
            .delete(`${ROUTES.BLOGS}/${secondBlogId}`)
            .set(getAuthorization())
            .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

        //checking that the blog was deleted
        await request.get(`${ROUTES.BLOGS}/${secondBlogId}`).expect(HTTP_STATUS_CODES.NOT_FOUND_404);

        const { body } = await request.get(ROUTES.BLOGS).expect(HTTP_STATUS_CODES.OK_200);
        expect(body.length).toBe(3);
    });

    it('returns 404 status code if the blog was not founded by requested ID', async () => {
        await request
            .delete(`${ROUTES.BLOGS}/${fakeRequestedObjectId}`)
            .set(getAuthorization())
            .expect(HTTP_STATUS_CODES.NOT_FOUND_404);
    });

    it('return 401 Unauthorized status code if there is no proper Authorization header', async () => {
        const secondBlogId = await dbHelper.getSecondBlogId();

        await request.delete(`${ROUTES.BLOGS}/${secondBlogId}`).expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    });
});
