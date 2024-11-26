import { dbHelper, request } from '../test-helpers';
import { HTTP_STATUS_CODES, ROUTES } from '../../constants';
import { blogs, posts, fakeRequestedObjectId } from '../dataset';

describe('get all posts by blog id', () => {
    beforeAll(async () => {
        await dbHelper.connectToDb();
    });

    beforeEach(async () => {
        await dbHelper.setDb({ blogs, posts });
    });

    afterEach(async () => {
        await dbHelper.resetCollections(['blogs', 'posts']);
    });

    afterAll(async () => {
        await dbHelper.dropDb();
        await dbHelper.closeConnection();
    });

    const secondBlogId = blogs[1]._id.toString();

    it('returns all posts associated with provided blogId with default configuration', async () => {
        //requesting all posts associated with provided blogId
        const { body } = await request
            .get(`${ROUTES.BLOGS}/${secondBlogId}${ROUTES.POSTS}`)
            .expect(HTTP_STATUS_CODES.OK_200);

        expect(body.totalCount).toBe(2);
        expect(body.pagesCount).toBe(1);
        expect(body.page).toBe(1);
        expect(body.pageSize).toBe(10);
        expect(new Date(body.items[0].createdAt).getTime()).toBeGreaterThanOrEqual(
            new Date(body.items[1].createdAt).getTime()
        );
    });

    it('returns all posts associated with provided blogId according to requested query parameters', async () => {
        const queryString = `?pageNumber=1&pageSize=1&sortBy=createdAt&sortDirection=asc`;

        const { body } = await request
            .get(`${ROUTES.BLOGS}/${secondBlogId}${ROUTES.POSTS}${queryString}`)
            .expect(HTTP_STATUS_CODES.OK_200);

        expect(body.totalCount).toBe(2);
        expect(body.pagesCount).toBe(2);
        expect(body.page).toBe(1);
        expect(body.pageSize).toBe(1);
        expect(body.items.length).toBe(1);
    });

    it('returns 404 status code if requested blog does not exist', async () => {
        //requesting blog by id
        await request
            .get(`${ROUTES.BLOGS}/${fakeRequestedObjectId}${ROUTES.POSTS}`)
            .expect(HTTP_STATUS_CODES.NOT_FOUND_404);
    });
});
