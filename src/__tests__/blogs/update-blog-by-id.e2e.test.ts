import { dbHelper, request, createErrorMessages, getAuthorization } from '../test-helpers';
import { HTTP_STATUS_CODES, ROUTES } from '../../constants';
import { blogs, fakeRequestedObjectId, longDescription, longWebsiteUrl } from '../dataset';
import { CreateUpdateBlogInputDTO } from '../../features/blogs/application';

describe('update blog by id', () => {
    beforeAll(async () => {
        await dbHelper.connectToDb();
    });

    beforeEach(async () => {
        await dbHelper.setDb({ blogs });
    });

    afterEach(async () => {
        await dbHelper.resetCollections(['blogs']);
    });

    afterAll(async () => {
        await dbHelper.dropDb();
        await dbHelper.closeConnection();
    });

    let requestedId: string;

    it('updates blog by id', async () => {
        requestedId = (await dbHelper.getBlog(1))._id.toString();

        const updatedBlog: CreateUpdateBlogInputDTO = {
            description: 'New description',
            name: 'New name',
            websiteUrl: 'https://website.com',
        };

        //updating blog
        await request
            .put(`${ROUTES.BLOGS}/${requestedId}`)
            .set(getAuthorization())
            .send(updatedBlog)
            .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

        //checking that the blog was updated
        const { body } = await request.get(`${ROUTES.BLOGS}/${requestedId}`).expect(HTTP_STATUS_CODES.OK_200);

        expect(body).toEqual({ id: requestedId, createdAt: expect.any(String), isMembership: false, ...updatedBlog });
    });

    describe('blog payload validation', () => {
        describe('name', () => {
            it('returns 400 status code and proper error object if `name` is missing', async () => {
                //@ts-expect-error bad request (name is missing)
                const updatedBlog: CreateUpdateBlogInputDTO = {
                    description: 'New description',
                    websiteUrl: 'https://website.com',
                };
                const { body } = await request
                    .put(`${ROUTES.BLOGS}/${requestedId}`)
                    .set(getAuthorization())
                    .send(updatedBlog)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ name: ['isRequired'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object if `name` is empty or contain only spaces', async () => {
                const updatedBlog: CreateUpdateBlogInputDTO = {
                    name: ' ',
                    description: 'Eco lifestyle description',
                    websiteUrl: 'https://ecolifestyle.com',
                };
                const { body } = await request
                    .put(`${ROUTES.BLOGS}/${requestedId}`)
                    .set(getAuthorization())
                    .send(updatedBlog)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ name: ['isEmptyString'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `name` type', async () => {
                const updatedBlog: CreateUpdateBlogInputDTO = {
                    //@ts-expect-error bad request (name type is invalid)
                    name: [],
                    description: 'New description',
                    websiteUrl: 'https://website.com',
                };
                const { body } = await request
                    .put(`${ROUTES.BLOGS}/${requestedId}`)
                    .set(getAuthorization())
                    .send(updatedBlog)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ name: ['isString'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `name` max length', async () => {
                const updatedBlog: CreateUpdateBlogInputDTO = {
                    name: 'More than fifteen characters',
                    description: 'New description',
                    websiteUrl: 'https://website.com',
                };
                const { body } = await request
                    .put(`${ROUTES.BLOGS}/${requestedId}`)
                    .set(getAuthorization())
                    .send(updatedBlog)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ name: ['maxLength'] })).toEqual(body);
            });
        });

        describe('description', () => {
            it('returns 400 status code and proper error object if `description` is missing', async () => {
                //@ts-expect-error bad request (description is missing)
                const updatedBlog: CreateUpdateBlogInputDTO = {
                    name: 'New name',
                    websiteUrl: 'https://website.com',
                };
                const { body } = await request
                    .put(`${ROUTES.BLOGS}/${requestedId}`)
                    .set(getAuthorization())
                    .send(updatedBlog)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ description: ['isRequired'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object if `description` is empty or contain only spaces', async () => {
                const updatedBlog: CreateUpdateBlogInputDTO = {
                    name: 'New name',
                    description: ' ',
                    websiteUrl: 'https://ecolifestyle.com',
                };
                const { body } = await request
                    .put(`${ROUTES.BLOGS}/${requestedId}`)
                    .set(getAuthorization())
                    .send(updatedBlog)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ description: ['isEmptyString'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `description` type', async () => {
                const updatedBlog: CreateUpdateBlogInputDTO = {
                    name: 'New name',
                    //@ts-expect-error bad request (description type is invalid)
                    description: [],
                    websiteUrl: 'https://website.com',
                };
                const { body } = await request
                    .put(`${ROUTES.BLOGS}/${requestedId}`)
                    .set(getAuthorization())
                    .send(updatedBlog)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ description: ['isString'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `description` max length', async () => {
                const updatedBlog: CreateUpdateBlogInputDTO = {
                    name: 'New name',
                    description: longDescription,
                    websiteUrl: 'https://website.com',
                };
                const { body } = await request
                    .put(`${ROUTES.BLOGS}/${requestedId}`)
                    .set(getAuthorization())
                    .send(updatedBlog)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ description: ['maxLength'] })).toEqual(body);
            });
        });

        describe('websiteUrl', () => {
            it('returns 400 status code and proper error object if `websiteUrl` is missing', async () => {
                //@ts-expect-error bad request (websiteUrl is missing)
                const updatedBlog: CreateUpdateBlogInputDTO = {
                    name: 'New name',
                    description: 'New description',
                };
                const { body } = await request
                    .put(`${ROUTES.BLOGS}/${requestedId}`)
                    .set(getAuthorization())
                    .send(updatedBlog)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ websiteUrl: ['isRequired'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object if `websiteUrl` is empty or contain only spaces', async () => {
                const updatedBlog: CreateUpdateBlogInputDTO = {
                    name: 'New name',
                    description: 'New description',
                    websiteUrl: ' ',
                };
                const { body } = await request
                    .put(`${ROUTES.BLOGS}/${requestedId}`)
                    .set(getAuthorization())
                    .send(updatedBlog)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ websiteUrl: ['isEmptyString'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `websiteUrl` type', async () => {
                const updatedBlog: CreateUpdateBlogInputDTO = {
                    name: 'New name',
                    description: 'New description',
                    //@ts-expect-error bad request (websiteUrl type is invalid)
                    websiteUrl: [],
                };
                const { body } = await request
                    .put(`${ROUTES.BLOGS}/${requestedId}`)
                    .set(getAuthorization())
                    .send(updatedBlog)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ websiteUrl: ['isString'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `websiteUrl` max length', async () => {
                const updatedBlog: CreateUpdateBlogInputDTO = {
                    name: 'New name',
                    description: 'New description',
                    websiteUrl: longWebsiteUrl,
                };
                const { body } = await request
                    .put(`${ROUTES.BLOGS}/${requestedId}`)
                    .set(getAuthorization())
                    .send(updatedBlog)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ websiteUrl: ['maxLength'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for invalid `websiteUrl` format', async () => {
                const updatedBlog: CreateUpdateBlogInputDTO = {
                    name: 'Eco Lifestyle',
                    description: 'Eco lifestyle description',
                    websiteUrl: 'invalid-url',
                };
                const { body } = await request
                    .put(`${ROUTES.BLOGS}/${requestedId}`)
                    .set(getAuthorization())
                    .send(updatedBlog)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ websiteUrl: ['isPattern'] })).toEqual(body);
            });
        });
    });

    it('returns 401 Unauthorized status code if there is no proper Authorization header', async () => {
        const updatedBlog: CreateUpdateBlogInputDTO = {
            description: 'Eco lifestyle description',
            name: 'Eco Lifestyle',
            websiteUrl: 'https://ecolifestyle.com',
        };

        await request
            .put(`${ROUTES.BLOGS}/${requestedId}`)
            .send(updatedBlog)
            .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    });

    it('return 404 status code if there is no blog in database', async () => {
        const updatedBlog: CreateUpdateBlogInputDTO = {
            description: 'New description',
            name: 'New name',
            websiteUrl: 'https://ecolifestyle.com',
        };

        await request
            .put(`${ROUTES.BLOGS}/${fakeRequestedObjectId}`)
            .set(getAuthorization())
            .send(updatedBlog)
            .expect(HTTP_STATUS_CODES.NOT_FOUND_404);
    });
});
