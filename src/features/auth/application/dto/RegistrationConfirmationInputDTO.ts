/**
 * Represents the input model for registration confirmation.
 */
export type RegistrationConfirmationInputDTO = {
    /**
     * A confirmation code for the user completing registration.
     * This code is sent to the user's email.
     * @type {string}
     * @required
     */
    code: string;
};
