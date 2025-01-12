import { LikeStatus } from '../../../../constants';

/**
 * Represents the DTO for creating a like.
 */
export type CreateLikeDTO = {
    /**
     * The unique identifier for the parent like belongs to.
     * @type {string}
     * @required
     */
    parentId: string;

    /**
     * The unique identifier for the user like belongs to.
     * @type {string}
     * @required
     */
    userId: string;

    /**
     * The like status of the comment.
     * Send "None" if you want to remove a like or dislike.
     * @type {LikeStatus}
     * @required
     * @enum {string}
     */
    status: 'Like' | 'Dislike';
};
