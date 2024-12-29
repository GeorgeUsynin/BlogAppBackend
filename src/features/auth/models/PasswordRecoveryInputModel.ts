/**
 * Represents the input model for password recovery.
 */
export type PasswordRecoveryInputModel = {
    /**
     * The email address of the user for recovering their password.
     * This email is associated with the user's account.
     * Example: `example@example.com`.
     * @type {string}
     * @required
     * @pattern ^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$
     */
    email: string;
};
