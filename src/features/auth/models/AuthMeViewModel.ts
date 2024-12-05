/**
 * Represents the output model for authenticated user (AuthMeViewModel).
 */
export type AuthMeViewModel = {
    /**
     * The email of the authenticated user.
     * Must be a valid email address.
     * @type {string}
     * @required
     */
    email: string;

    /**
     * The unique login name of the authenticated user.
     * This is distinct from the email and serves as the primary username.
     * @type {string}
     * @required
     */
    login: string;

    /**
     * A unique identifier for the authenticated user.
     * Database-generated user ID.
     * @type {string}
     * @required
     */
    userId: string;
};
