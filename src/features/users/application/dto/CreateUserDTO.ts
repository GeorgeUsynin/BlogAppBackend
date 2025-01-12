/**
 * Represents the DTO for creating a user.
 */
export type CreateUserDTO = {
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
     * The user's password hash.
     * @type {string}
     * @required
     */
    passwordHash: string;

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
