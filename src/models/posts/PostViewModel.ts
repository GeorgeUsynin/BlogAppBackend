/**
 * Represents the model for a blog post.
 */
export type PostViewModel = {
    /**
     * The unique identifier for the post.
     * @type {string}
     * @required
     */
    id: string;

    /**
     * The title of the post.
     * @type {string}
     * @required
     */
    title: string;

    /**
     * A short description of the post, providing a brief overview.
     * @type {string}
     * @required
     */
    shortDescription: string;

    /**
     * The full content of the post.
     * @type {string}
     * @required
     */
    content: string;

    /**
     * The unique identifier for the blog this post belongs to.
     * @type {string}
     * @required
     */
    blogId: string;

    /**
     * The name of the blog this post belongs to.
     * @type {string}
     * @required
     */
    blogName: string;
};
