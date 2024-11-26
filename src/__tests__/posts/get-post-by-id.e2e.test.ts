import { dbHelper, request } from '../test-helpers';
import { HTTP_STATUS_CODES, ROUTES } from '../../constants';
import { fakeRequestedObjectId, posts } from '../dataset';

describe('get post by id', () => {
    beforeAll(async () => {
        await dbHelper.connectToDb();
    });

    beforeEach(async () => {
        await dbHelper.setDb({ blogs: [], posts });
    });

    afterEach(async () => {
        await dbHelper.resetCollections(['posts']);
    });

    afterAll(async () => {
        await dbHelper.dropDb();
        await dbHelper.closeConnection();
    });

    it('returns post by requested id', async () => {
        const { body: allPosts } = await request.get(ROUTES.POSTS).expect(HTTP_STATUS_CODES.OK_200);
        const secondPostId = allPosts.items[1].id;

        //requesting post by id
        const { body } = await request.get(`${ROUTES.POSTS}/${secondPostId}`).expect(HTTP_STATUS_CODES.OK_200);

        expect(body).toEqual(allPosts.items[1]);
    });

    it('returns 404 status code if there is no requested post in database', async () => {
        //requesting post by id
        await request.get(`${ROUTES.POSTS}/${fakeRequestedObjectId}`).expect(HTTP_STATUS_CODES.NOT_FOUND_404);
    });
});
