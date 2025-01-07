/**
 * Represents the input model for creating a user.
 */
export type CreateUserInputDTO = {
    /**
     * The unique login for the user.
     * Must be between 3 and 10 characters in length.
     * Can only contain alphanumeric characters, underscores, and dashes.
     * @type {string}
     * @required
     * @maxLength 10
     * @minLength 3
     * @pattern ^[a-zA-Z0-9_-]*$
     * @unique
     */
    login: string;

    /**
     * The user's password.
     * Must be between 6 and 20 characters in length.
     * @type {string}
     * @required
     * @maxLength 20
     * @minLength 6
     */
    password: string;

    /**
     * The email address of the user.
     * Must match a valid email format.
     * Example: example@example.com
     * @type {string}
     * @required
     * @pattern ^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$
     * @unique
     */
    email: string;
};
