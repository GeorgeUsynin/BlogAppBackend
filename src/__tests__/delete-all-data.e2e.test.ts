import { dbHelper, getAuthorization, request } from './test-helpers';
import { HTTP_STATUS_CODES, ROUTES } from '../constants';
import { blogs, posts, users } from './dataset';

describe('/testing/all-data', () => {
    beforeAll(async () => {
        await dbHelper.connectToDb();
    });

    afterAll(async () => {
        await dbHelper.dropDb();
        await dbHelper.closeConnection();
    });

    it('deletes all data from database', async () => {
        //populating the database with blogs
        await dbHelper.setDb({ blogs, posts, users });

        // checking if all blogs are in the database
        const { body: allBlogs } = await request.get(ROUTES.BLOGS).expect(HTTP_STATUS_CODES.OK_200);
        expect(allBlogs.totalCount).toBe(4);
        // checking if all posts are in the database
        const { body: allPosts } = await request.get(ROUTES.POSTS).expect(HTTP_STATUS_CODES.OK_200);
        expect(allPosts.totalCount).toBe(8);
        // checking if all users are in the database
        const { body: allUsers } = await request
            .get(ROUTES.USERS)
            .set(getAuthorization())
            .expect(HTTP_STATUS_CODES.OK_200);
        expect(allUsers.totalCount).toBe(4);

        // deleting all data
        await request.delete(ROUTES.TESTING).expect(HTTP_STATUS_CODES.NO_CONTENT_204);

        // checking if all data is deleted
        const { body: allBlogsAfterDeletion } = await request.get(ROUTES.BLOGS).expect(HTTP_STATUS_CODES.OK_200);
        expect(allBlogsAfterDeletion.totalCount).toBe(0);
        const { body: allPostsAfterDeletion } = await request.get(ROUTES.POSTS).expect(HTTP_STATUS_CODES.OK_200);
        expect(allPostsAfterDeletion.totalCount).toBe(0);
        const { body: allUsersAfterDeletion } = await request
            .get(ROUTES.USERS)
            .set(getAuthorization())
            .expect(HTTP_STATUS_CODES.OK_200);
        expect(allUsersAfterDeletion.totalCount).toBe(0);
    });
});
