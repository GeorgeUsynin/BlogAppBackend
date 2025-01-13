import { LikeStatus } from '../../../../constants';
import { PaginatedViewModel } from '../../../shared/types';
/**
 * Represents the paginated response model for posts.
 */
export type PostsPaginatedViewModel = PaginatedViewModel<PostItemViewModel>;

/**
 * Represents the model for a blog post.
 */
export type PostItemViewModel = {
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

    /**
     * The date and time when the post was created.
     * @type {string}
     */
    createdAt: string;

    /**
     * Extended likes information for the post.
     * @type {ExtendedLikesInfoViewModel}
     */
    extendedLikesInfo: ExtendedLikesInfoViewModel;
};

/**
 * Represents the extended likes information view model.
 */
export type ExtendedLikesInfoViewModel = {
    /**
     * Total likes for the parent item.
     * @type {number}
     */
    likesCount: number;

    /**
     * Total dislikes for the parent item.
     * @type {number}
     */
    dislikesCount: number;

    /**
     * The like status of the current user.
     * @type {LikeStatus}
     */
    myStatus: keyof typeof LikeStatus;

    /**
     * Last 3 likes (status "Like").
     * @type {LikeDetailsViewModel[] | null}
     */
    newestLikes: LikeDetailsViewModel[] | null;
};

/**
 * Represents the details of a single like.
 */
export type LikeDetailsViewModel = {
    /**
     * The date and time when the like was added.
     * @type {string}
     */
    addedAt: string;

    /**
     * The user ID of the person who liked.
     * @type {string | null}
     */
    userId: string | null;

    /**
     * The login of the user who liked.
     * @type {string | null}
     */
    login: string | null;
};
