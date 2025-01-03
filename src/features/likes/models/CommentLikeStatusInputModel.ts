import { LikeStatus } from '../../../constants';

/**
 * Represents the input model for setting the like or dislike status of a comment.
 */
export type CommentLikeStatusInputModel = {
    /**
     * The like status of the comment.
     * Send "None" if you want to remove a like or dislike.
     * @type {LikeStatus}
     * @required
     * @enum {string}
     */
    likeStatus: keyof typeof LikeStatus;
};
