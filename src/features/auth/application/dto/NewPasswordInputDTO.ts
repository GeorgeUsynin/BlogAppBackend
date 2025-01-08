/**
 * Represents the input model for setting a new password.
 */
export type NewPasswordInputDTO = {
    /**
     * The new password for the user.
     * @type {string}
     * @required
     * @maxLength 20
     * @minLength 6
     */
    newPassword: string;

    /**
     * A recovery code used to set the new password.
     * @type {string}
     * @required
     */
    recoveryCode: string;
};
