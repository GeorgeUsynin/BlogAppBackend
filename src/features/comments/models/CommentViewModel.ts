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
