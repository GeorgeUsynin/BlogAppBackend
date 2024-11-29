/**
 * Defines the URI parameter structure for fetching a blog along with its associated posts.
 */
export type URIParamsBlogIDPostModel = {
    /**
     * The unique identifier of the requested blog, provided as a string.
     * @type {string}
     * @required
     */
    id: string;
};
