/**
 * Represents the input model for creating or updating an existing blog.
 */
export type CreateUpdateBlogInputModel = {
    /**
     * The name of the blog.
     * @type {string}
     * @required
     * @maxLength 15
     */
    name: string;

    /**
     * A description of the blog, providing details about its focus or content.
     * @type {string}
     * @required
     * @maxLength 500
     */
    description: string;

    /**
     * The URL of the blog's website.
     * @type {string}
     * @required
     * @maxLength 100
     * @pattern ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$
     */
    websiteUrl: string;
};
