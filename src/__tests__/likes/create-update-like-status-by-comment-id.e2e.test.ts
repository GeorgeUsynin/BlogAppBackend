import { createErrorMessages, dbHelper, getBearerAuthorization, request } from '../test-helpers';
import { HTTP_STATUS_CODES, ROUTES } from '../../constants';
import { users, comments, fakeRequestedObjectId } from '../dataset';
import { LikeStatusInputDTO } from '../../features/likes/application';

describe('create/update like by comment ID', () => {
    beforeAll(async () => {
        await dbHelper.connectToDb();
    });

    beforeEach(async () => {
        await dbHelper.setDb({ users, comments });
    });

    afterEach(async () => {
        await dbHelper.resetCollections(['users', 'comments', 'likes']);
    });

    afterAll(async () => {
        await dbHelper.dropDb();
        await dbHelper.closeConnection();
    });

    const secondCommentId = comments[1]._id.toString();
    const firstUser = users[0];
    const secondUser = users[1];

    it('passes the flow of adding/removing likes/dislikes', async () => {
        //requesting comment by id
        const { body } = await request.get(`${ROUTES.COMMENTS}/${secondCommentId}`).expect(HTTP_STATUS_CODES.OK_200);

        expect(body.likesInfo.likesCount).toBe(0);
        expect(body.likesInfo.dislikesCount).toBe(0);
        expect(body.likesInfo.myStatus).toBe('None');

        // adding two likes
        await request
            .put(`${ROUTES.COMMENTS}/${secondCommentId}${ROUTES.LIKE_STATUS}`)
            .set(getBearerAuthorization(firstUser._id.toString()))
            .send({ likeStatus: 'Like' })
            .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

        await request
            .put(`${ROUTES.COMMENTS}/${secondCommentId}${ROUTES.LIKE_STATUS}`)
            .set(getBearerAuthorization(secondUser._id.toString()))
            .send({ likeStatus: 'Like' })
            .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

        const { body: body1 } = await request
            .get(`${ROUTES.COMMENTS}/${secondCommentId}`)
            .expect(HTTP_STATUS_CODES.OK_200);

        expect(body1.likesInfo.likesCount).toBe(2);
        expect(body1.likesInfo.dislikesCount).toBe(0);

        // adding dislike
        await request
            .put(`${ROUTES.COMMENTS}/${secondCommentId}${ROUTES.LIKE_STATUS}`)
            .set(getBearerAuthorization(secondUser._id.toString()))
            .send({ likeStatus: 'Dislike' })
            .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

        const { body: body2 } = await request
            .get(`${ROUTES.COMMENTS}/${secondCommentId}`)
            .expect(HTTP_STATUS_CODES.OK_200);

        expect(body2.likesInfo.likesCount).toBe(1);
        expect(body2.likesInfo.dislikesCount).toBe(1);

        // adding another dislike from the same user for the same comment (should not change counters)
        await request
            .put(`${ROUTES.COMMENTS}/${secondCommentId}${ROUTES.LIKE_STATUS}`)
            .set(getBearerAuthorization(secondUser._id.toString()))
            .send({ likeStatus: 'Dislike' })
            .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

        const { body: body3 } = await request
            .get(`${ROUTES.COMMENTS}/${secondCommentId}`)
            .expect(HTTP_STATUS_CODES.OK_200);

        expect(body3.likesInfo.likesCount).toBe(1);
        expect(body3.likesInfo.dislikesCount).toBe(1);

        // checking myStatus for authorized user
        const { body: body4 } = await request
            .get(`${ROUTES.COMMENTS}/${secondCommentId}`)
            .set(getBearerAuthorization(secondUser._id.toString()))
            .expect(HTTP_STATUS_CODES.OK_200);

        expect(body4.likesInfo.likesCount).toBe(1);
        expect(body4.likesInfo.dislikesCount).toBe(1);
        expect(body4.likesInfo.myStatus).toBe('Dislike');
    });

    it('returns 404 status code if there is no requested comment in database', async () => {
        const payload: LikeStatusInputDTO = {
            likeStatus: 'Like',
        };

        //requesting comment by id
        await request
            .put(`${ROUTES.COMMENTS}/${fakeRequestedObjectId}${ROUTES.LIKE_STATUS}`)
            .set(getBearerAuthorization(firstUser._id.toString()))
            .send(payload)
            .expect(HTTP_STATUS_CODES.NOT_FOUND_404);
    });

    describe('validation', () => {
        describe('likeStatus', () => {
            it('returns 400 status code and proper error object if `likeStatus` is missing', async () => {
                //@ts-expect-error bad request (likeStatus is missing)
                const payload: LikeStatusInputDTO = {};
                const { body } = await request
                    .put(`${ROUTES.COMMENTS}/${secondCommentId}${ROUTES.LIKE_STATUS}`)
                    .set(getBearerAuthorization(firstUser._id.toString()))
                    .send(payload)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ likeStatus: ['isRequired'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object if `likeStatus` is empty or contain only spaces', async () => {
                const payload: LikeStatusInputDTO = {
                    //@ts-expect-error bad request (likeStatus contain only spaces)
                    likeStatus: ' ',
                };
                const { body } = await request
                    .put(`${ROUTES.COMMENTS}/${secondCommentId}${ROUTES.LIKE_STATUS}`)
                    .set(getBearerAuthorization(firstUser._id.toString()))
                    .send(payload)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ likeStatus: ['isEmptyString'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `likeStatus` type', async () => {
                const payload: LikeStatusInputDTO = {
                    //@ts-expect-error bad request (likeStatus type is invalid)
                    likeStatus: [],
                };
                const { body } = await request
                    .put(`${ROUTES.COMMENTS}/${secondCommentId}${ROUTES.LIKE_STATUS}`)
                    .set(getBearerAuthorization(firstUser._id.toString()))
                    .send(payload)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ likeStatus: ['isString'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `likeStatus` value', async () => {
                const payload: LikeStatusInputDTO = {
                    //@ts-expect-error bad request (likeStatus value is invalid)
                    likeStatus: 'Nan',
                };
                const { body } = await request
                    .put(`${ROUTES.COMMENTS}/${secondCommentId}${ROUTES.LIKE_STATUS}`)
                    .set(getBearerAuthorization(firstUser._id.toString()))
                    .send(payload)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ likeStatus: ['isEqualTo'] })).toEqual(body);
            });
        });
    });

    it('returns 401 status code if request is not authorized', async () => {
        const payload: LikeStatusInputDTO = {
            likeStatus: 'Like',
        };

        //requesting comment by id
        await request
            .put(`${ROUTES.COMMENTS}/${secondCommentId}${ROUTES.LIKE_STATUS}`)
            .set({})
            .send(payload)
            .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    });
});
