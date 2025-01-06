/**
 * Represents the input model for creating or updating a blog post.
 */
export type CreateUpdatePostInputDTO = {
    /**
     * The title of the post.
     * @type {string}
     * @required
     * @maxLength 30
     */
    title: string;

    /**
     * A short description of the post, providing a brief overview.
     * @type {string}
     * @required
     * @maxLength 100
     */
    shortDescription: string;

    /**
     * The full content of the post.
     * @type {string}
     * @required
     * @maxLength 1000
     */
    content: string;

    /**
     * The unique identifier for the blog this post belongs to.
     * @type {string}
     * @required
     */
    blogId: string;
};
