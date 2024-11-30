import { dbHelper, request, getAuthorization } from '../test-helpers';
import { HTTP_STATUS_CODES, ROUTES } from '../../constants';
import { fakeRequestedObjectId, posts } from '../dataset';

describe('delete post by id', () => {
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
    it('deletes post from database by providing ID', async () => {
        const secondPostId = (await dbHelper.getPost(1))._id.toString();

        await request
            .delete(`${ROUTES.POSTS}/${secondPostId}`)
            .set(getAuthorization())
            .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

        //checking that the post was deleted
        await request.get(`${ROUTES.POSTS}/${secondPostId}`).expect(HTTP_STATUS_CODES.NOT_FOUND_404);

        const { body } = await request.get(ROUTES.POSTS).expect(HTTP_STATUS_CODES.OK_200);
        expect(body.totalCount).toBe(7);
    });

    it('returns 404 status code if the post was not founded by requested ID', async () => {
        await request
            .delete(`${ROUTES.POSTS}/${fakeRequestedObjectId}`)
            .set(getAuthorization())
            .expect(HTTP_STATUS_CODES.NOT_FOUND_404);
    });

    it('returns 401 Unauthorized status code if there is no proper Authorization header', async () => {
        const secondPostId = (await dbHelper.getPost(1))._id.toString();

        await request.delete(`${ROUTES.POSTS}/${secondPostId}`).expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    });
});
