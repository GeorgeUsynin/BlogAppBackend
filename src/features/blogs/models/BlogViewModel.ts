/**
 * Represents the model for a blog.
 */
export type BlogViewModel = {
    /**
     * The unique identifier for the blog.
     * @type {string}
     * @required
     */
    id: string;

    /**
     * The name of the blog.
     * @type {string}
     * @required
     */
    name: string;

    /**
     * A description of the blog, providing details about its focus or content.
     * @type {string}
     * @required
     */
    description: string;

    /**
     * The URL of the blog's website.
     * @type {string}
     * @required
     */
    websiteUrl: string;

    /**
     * The date and time when the blog was created.
     * @type {string}
     */
    createdAt: string;

    /**
     * Indicates whether the user is a member of the blog.
     * @type {boolean}
     */
    isMembership: boolean;
};
