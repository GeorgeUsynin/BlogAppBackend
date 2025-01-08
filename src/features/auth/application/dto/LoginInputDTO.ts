/**
 * Represents the input model for logging in.
 */
export type LoginInputDTO = {
    /**
     * The login or email for the user attempting to authenticate.
     * It can be either the unique login or the email address of the user.
     * @type {string}
     * @required
     */
    loginOrEmail: string;

    /**
     * The password for the user attempting to authenticate.
     * Must meet the desired password constraints.
     * @type {string}
     * @required
     */
    password: string;
};
