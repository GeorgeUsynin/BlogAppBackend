/**
 * Represents the input model for user registration.
 */
export type RegistrationInputDTO = {
    /**
     * The username of the user.
     * Must be unique and meet the specified constraints.
     * @type {string}
     * @required
     * @maxLength 10
     * @minLength 3
     * @pattern ^[a-zA-Z0-9_-]*$
     */
    login: string;

    /**
     * The user's password.
     * Must adhere to the defined length constraints and security standards.
     * @type {string}
     * @required
     * @maxLength 20
     * @minLength 6
     */
    password: string;

    /**
     * The email address of the user.
     * Must be unique and follow a valid email format.
     * Example: `example@example.com`.
     * @type {string}
     * @required
     * @pattern ^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$
     */
    email: string;
};
