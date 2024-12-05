import { dbHelper, request } from '../test-helpers';
import { HTTP_STATUS_CODES, ROUTES } from '../../constants';
import { blogs, comments, posts, fakeRequestedObjectId } from '../dataset';

describe('get all comments by post id', () => {
    beforeAll(async () => {
        await dbHelper.connectToDb();
    });

    beforeEach(async () => {
        await dbHelper.setDb({ blogs, posts, comments });
    });

    afterEach(async () => {
        await dbHelper.resetCollections(['posts', 'comments']);
    });

    afterAll(async () => {
        await dbHelper.dropDb();
        await dbHelper.closeConnection();
    });

    const secondPostId = posts[1]._id.toString();

    it('returns all comments associated with provided postId with default configuration', async () => {
        //requesting all comments associated with provided postId
        const { body } = await request
            .get(`${ROUTES.POSTS}/${secondPostId}${ROUTES.COMMENTS}`)
            .expect(HTTP_STATUS_CODES.OK_200);

        expect(body.totalCount).toBe(2);
        expect(body.pagesCount).toBe(1);
        expect(body.page).toBe(1);
        expect(body.pageSize).toBe(10);
        expect(new Date(body.items[0].createdAt).getTime()).toBeGreaterThanOrEqual(
            new Date(body.items[1].createdAt).getTime()
        );
    });

    it('returns all comments associated with provided postId according to requested query parameters', async () => {
        const queryString = `?pageNumber=1&pageSize=1&sortBy=createdAt&sortDirection=asc`;

        const { body } = await request
            .get(`${ROUTES.POSTS}/${secondPostId}${ROUTES.COMMENTS}${queryString}`)
            .expect(HTTP_STATUS_CODES.OK_200);

        expect(body.totalCount).toBe(2);
        expect(body.pagesCount).toBe(2);
        expect(body.page).toBe(1);
        expect(body.pageSize).toBe(1);
        expect(body.items.length).toBe(1);
    });

    it('returns 404 status code if requested post does not exist', async () => {
        //requesting post by id
        await request
            .get(`${ROUTES.POSTS}/${fakeRequestedObjectId}${ROUTES.COMMENTS}`)
            .expect(HTTP_STATUS_CODES.NOT_FOUND_404);
    });
});
