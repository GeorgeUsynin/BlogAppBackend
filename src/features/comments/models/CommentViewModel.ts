import { LikeStatus } from '../../../constants';
import { PaginatedViewModel } from '../../shared/types';

/**
 * Represents the paginated response model for comments.
 */
export type CommentsPaginatedViewModel = PaginatedViewModel<CommentItemViewModel>;

/**
 * Represents the model for a single comment.
 */
export type CommentItemViewModel = {
    /**
     * The unique identifier for the comment.
     * @type {string}
     * @required
     */
    id: string;

    /**
     * The content of the comment.
     * @type {string}
     * @required
     */
    content: string;

    /**
     * Information about the commentator.
     * Includes user ID and user login details.
     * @type {CommentatorInfo}
     * @required
     */
    commentatorInfo: CommentatorInfo;

    /**
     * The date and time when the comment was created.
     * @type {string}
     * @required
     */
    createdAt: string;

    /**
     * Information about likes and dislikes for the comment.
     * @type {LikesInfoViewModel}
     * @required
     */
    likesInfo: LikesInfoViewModel;
};

/**
 * Represents information about the commentator.
 */
type CommentatorInfo = {
    /**
     * The unique identifier for the user who made the comment.
     * @type {string}
     * @required
     */
    userId: string;

    /**
     * The username or login of the user who made the comment.
     * @type {string}
     * @required
     */
    userLogin: string;
};

/**
 * Represents information about likes and dislikes.
 */
export type LikesInfoViewModel = {
    /**
     * Total likes for the parent item.
     * @type {number}
     * @required
     */
    likesCount: number;

    /**
     * Total dislikes for the parent item.
     * @type {number}
     * @required
     */
    dislikesCount: number;

    /**
     * The current user's like status for the comment.
     * Send "None" if you want to unlike/undislike.
     * @type {LikeStatus}
     * @required
     * @enum {string}
     */
    myStatus: keyof typeof LikeStatus;
};
