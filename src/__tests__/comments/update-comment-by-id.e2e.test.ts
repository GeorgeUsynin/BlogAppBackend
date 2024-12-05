import { dbHelper, request, createErrorMessages, getAuthorization } from '../test-helpers';
import { HTTP_STATUS_CODES, ROUTES } from '../../constants';
import { comments, fakeRequestedObjectId, longContent, users } from '../dataset';
import { CreateUpdateCommentInputModel } from '../../features/comments/models';

describe('update comment by id', () => {
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

    const secondCommentId = comments[1]._id.toString();
    const secondUser = users[1];
    const fourthUser = users[3];

    it('updates comment by id', async () => {
        const updatedComment: CreateUpdateCommentInputModel = {
            content: 'New super content about my life',
        };

        //updating comment
        await request
            .put(`${ROUTES.COMMENTS}/${secondCommentId}`)
            .set(getBearerAuthorization(secondUser._id.toString()))
            .send(updatedComment)
            .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

        //checking that the comment was updated
        const { body } = await request.get(`${ROUTES.COMMENTS}/${secondCommentId}`).expect(HTTP_STATUS_CODES.OK_200);

        expect(body).toEqual({
            id: secondCommentId,
            createdAt: expect.any(String),
            commentatorInfo: {
                userId: expect.any(String),
                userLogin: expect.any(String),
            },
            ...updatedComment,
        });
    });

    describe('comment payload validation', () => {
        describe('content', () => {
            it('returns 400 status code and proper error object if `content` is missing', async () => {
                //@ts-expect-error bad request (content is missing)
                const updatedComment: CreateUpdateCommentInputModel = {};
                const { body } = await request
                    .put(`${ROUTES.COMMENTS}/${secondCommentId}`)
                    .set(getBearerAuthorization(secondUser._id.toString()))
                    .send(updatedComment)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ content: ['isRequired'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object if `content` is empty or contain only spaces', async () => {
                const updatedComment: CreateUpdateCommentInputModel = {
                    content: ' ',
                };
                const { body } = await request
                    .put(`${ROUTES.COMMENTS}/${secondCommentId}`)
                    .set(getBearerAuthorization(secondUser._id.toString()))
                    .send(updatedComment)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ content: ['isEmptyString'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `content` type', async () => {
                const updatedComment: CreateUpdateCommentInputModel = {
                    //@ts-expect-error bad request (content type is invalid)
                    content: [],
                };
                const { body } = await request
                    .put(`${ROUTES.COMMENTS}/${secondCommentId}`)
                    .set(getBearerAuthorization(secondUser._id.toString()))
                    .send(updatedComment)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ content: ['isString'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `content` min length', async () => {
                const updatedComment: CreateUpdateCommentInputModel = {
                    content: 'More',
                };
                const { body } = await request
                    .put(`${ROUTES.COMMENTS}/${secondCommentId}`)
                    .set(getBearerAuthorization(secondUser._id.toString()))
                    .send(updatedComment)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ content: ['minMaxLength'], from: 'comments' })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `content` max length', async () => {
                const updatedComment: CreateUpdateCommentInputModel = {
                    content: longContent,
                };
                const { body } = await request
                    .put(`${ROUTES.COMMENTS}/${secondCommentId}`)
                    .set(getBearerAuthorization(secondUser._id.toString()))
                    .send(updatedComment)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ content: ['minMaxLength'], from: 'comments' })).toEqual(body);
            });
        });
    });

    it('returns 401 Unauthorized status code if there is no proper Authorization header', async () => {
        const updatedComment: CreateUpdateCommentInputModel = {
            content: 'New super content about my life',
        };

        await request
            .put(`${ROUTES.COMMENTS}/${secondCommentId}`)
            .send(updatedComment)
            .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    });

    it('return 404 status code if there is no comment in database', async () => {
        const updatedComment: CreateUpdateCommentInputModel = {
            content: 'New super content about my life',
        };

        await request
            .put(`${ROUTES.COMMENTS}/${fakeRequestedObjectId}`)
            .set(getBearerAuthorization(secondUser._id.toString()))
            .send(updatedComment)
            .expect(HTTP_STATUS_CODES.NOT_FOUND_404);
    });

    it('returns 403 status code if user tries to update comment of another user', async () => {
        const updatedComment: CreateUpdateCommentInputModel = {
            content: 'New super content about my life',
        };

        await request
            .put(`${ROUTES.COMMENTS}/${secondCommentId}`)
            .set(getBearerAuthorization(fourthUser._id.toString()))
            .send(updatedComment)
            .expect(HTTP_STATUS_CODES.FORBIDDEN_403);
    });
});
