import { dbHelper, request, createErrorMessages } from '../test-helpers';
import { HTTP_STATUS_CODES, ROUTES } from '../../constants';
import { comments, posts, fakeRequestedObjectId, longContent, users } from '../dataset';
import { CommentItemViewModel, CreateUpdateCommentInputModel } from '../../features/comments/models';

describe('create a comment by requested postId', () => {
    beforeAll(async () => {
        await dbHelper.connectToDb();
    });

    beforeEach(async () => {
        await dbHelper.setDb({ posts, comments });
    });

    afterEach(async () => {
        await dbHelper.resetCollections(['posts', 'comments']);
    });

    afterAll(async () => {
        await dbHelper.dropDb();
        await dbHelper.closeConnection();
    });

    const secondPostId = posts[1]._id.toString();
    const secondUser = users[1];

    it('creates a new comment by requested postId', async () => {
        const newComment: CreateUpdateCommentInputModel = {
            content: "This is George's third comment.",
        };

        const createdComment: CommentItemViewModel = {
            id: expect.any(String),
            content: newComment.content,
            commentatorInfo: {
                userId: secondUser._id.toString(),
                userLogin: secondUser.login,
            },
            createdAt: expect.any(String),
        };

        //creating new comment
        const { body: newCommentBodyResponse } = await request
            .post(`${ROUTES.POSTS}/${secondPostId}${ROUTES.COMMENTS}`)
            .set(getBearerAuthorization(secondUser._id.toString()))
            .send(newComment)
            .expect(HTTP_STATUS_CODES.CREATED_201);

        expect(newCommentBodyResponse).toEqual(createdComment);

        //checking that the comment was created
        const { body: allCommentsBodyResponse } = await request
            .get(`${ROUTES.POSTS}/${secondPostId}${ROUTES.COMMENTS}`)
            .expect(HTTP_STATUS_CODES.OK_200);

        expect(allCommentsBodyResponse.items[0]).toEqual(createdComment);
        expect(allCommentsBodyResponse.items.length).toEqual(3);
    });

    describe('comment payload validation', () => {
        describe('content', () => {
            it('returns 400 status code and proper error object if `content` is missing', async () => {
                //@ts-expect-error bad request (content is missing)
                const newComment: CreateUpdateCommentInputModel = {};
                const { body } = await request
                    .post(`${ROUTES.POSTS}/${secondPostId}${ROUTES.COMMENTS}`)
                    .set(getBearerAuthorization(secondUser._id.toString()))
                    .send(newComment)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ content: ['isRequired'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object if `content` is empty or contain only spaces', async () => {
                const newComment: CreateUpdateCommentInputModel = {
                    content: ' ',
                };
                const { body } = await request
                    .post(`${ROUTES.POSTS}/${secondPostId}${ROUTES.COMMENTS}`)
                    .set(getBearerAuthorization(secondUser._id.toString()))
                    .send(newComment)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ content: ['isEmptyString'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `content` type', async () => {
                const newComment: CreateUpdateCommentInputModel = {
                    //@ts-expect-error bad request (content type is invalid)
                    content: [],
                };
                const { body } = await request
                    .post(`${ROUTES.POSTS}/${secondPostId}${ROUTES.COMMENTS}`)
                    .set(getBearerAuthorization(secondUser._id.toString()))
                    .send(newComment)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ content: ['isString'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `content` min length', async () => {
                const newComment: CreateUpdateCommentInputModel = {
                    content: 'content',
                };
                const { body } = await request
                    .post(`${ROUTES.POSTS}/${secondPostId}${ROUTES.COMMENTS}`)
                    .set(getBearerAuthorization(secondUser._id.toString()))
                    .send(newComment)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ content: ['minMaxLength'], from: 'comments' })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `content` max length', async () => {
                const newComment: CreateUpdateCommentInputModel = {
                    content: longContent,
                };
                const { body } = await request
                    .post(`${ROUTES.POSTS}/${secondPostId}${ROUTES.COMMENTS}`)
                    .set(getBearerAuthorization(secondUser._id.toString()))
                    .send(newComment)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ content: ['minMaxLength'], from: 'comments' })).toEqual(body);
            });
        });
    });

    it('returns 401 Unauthorized status code if there is no proper Authorization header', async () => {
        const newComment: CreateUpdateCommentInputModel = {
            content: "This is George's third comment.",
        };

        await request
            .post(`${ROUTES.POSTS}/${secondPostId}${ROUTES.COMMENTS}`)
            .send(newComment)
            .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    });

    it('returns 404 status code if there is no requested postId in database', async () => {
        const newComment: CreateUpdateCommentInputModel = {
            content: "This is George's third comment.",
        };

        await request
            .post(`${ROUTES.POSTS}/${fakeRequestedObjectId}${ROUTES.COMMENTS}`)
            .set(getBearerAuthorization(secondUser._id.toString()))
            .send(newComment)
            .expect(HTTP_STATUS_CODES.NOT_FOUND_404);
    });
});