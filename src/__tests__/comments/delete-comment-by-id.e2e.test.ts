import { request, dbHelper } from '../test-helpers';
import { HTTP_STATUS_CODES, ROUTES } from '../../constants';
import { comments, fakeRequestedObjectId, posts, users } from '../dataset';

describe('delete comment by id', () => {
    beforeAll(async () => {
        await dbHelper.connectToDb();
    });

    beforeEach(async () => {
        await dbHelper.setDb({ comments });
    });

    afterEach(async () => {
        await dbHelper.resetCollections(['comments']);
    });

    afterAll(async () => {
        await dbHelper.dropDb();
        await dbHelper.closeConnection();
    });

    const secondUser = users[1];
    const fourthUser = users[3];
    const secondPost = posts[1];

    it('deletes comment from database by providing ID', async () => {
        const secondCommentId = (await dbHelper.getComment(1))._id.toString();

        await request
            .delete(`${ROUTES.COMMENTS}/${secondCommentId}`)
            .set(getBearerAuthorization(secondUser._id.toString()))
            .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

        //checking that the comment was deleted
        await request.get(`${ROUTES.COMMENTS}/${secondCommentId}`).expect(HTTP_STATUS_CODES.NOT_FOUND_404);

        const { body } = await request
            .get(`${ROUTES.POSTS}/${secondPost._id.toString()}${ROUTES.COMMENTS}`)
            .expect(HTTP_STATUS_CODES.OK_200);
        expect(body.totalCount).toBe(1);
    });

    it('returns 404 status code if the comment was not founded by requested ID', async () => {
        await request
            .delete(`${ROUTES.COMMENTS}/${fakeRequestedObjectId}`)
            .set(getBearerAuthorization(secondUser._id.toString()))
            .expect(HTTP_STATUS_CODES.NOT_FOUND_404);
    });

    it('returns 401 Unauthorized status code if there is no proper Authorization header', async () => {
        const secondCommentId = (await dbHelper.getComment(1))._id.toString();

        await request.delete(`${ROUTES.COMMENTS}/${secondCommentId}`).expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    });

    it('returns 403 Forbidden status code if the user is not the owner of the comment', async () => {
        const secondCommentId = (await dbHelper.getComment(1))._id.toString();

        await request
            .delete(`${ROUTES.COMMENTS}/${secondCommentId}`)
            .set(getBearerAuthorization(fourthUser._id.toString()))
            .expect(HTTP_STATUS_CODES.FORBIDDEN_403);
    });
});
