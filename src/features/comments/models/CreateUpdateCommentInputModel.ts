/**
 * Represents the input model for creating or updating an existing comment.
 */
export type CreateUpdateCommentInputModel = {
    /**
     * The content of the comment.
     * @type {string}
     * @required
     * @minLength 20
     * @maxLength 300
     */
    content: string;
};
