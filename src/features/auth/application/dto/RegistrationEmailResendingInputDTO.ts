/**
 * Represents the input model for resending a registration confirmation email.
 */
export type RegistrationEmailResendingInputDTO = {
    /**
     * The email address of a user who has registered but has not yet confirmed their account.
     * Must follow a valid email format.
     * Example: `example@example.com`.
     * @type {string}
     * @required
     * @pattern ^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$
     */
    email: string;
};
