/**
 * Represents the view model for a successful login response.
 */
export type LoginViewModel = {
    /**
     * The access token issued upon successful authentication.
     * This token can be used for authorization in subsequent requests.
     * @type {string}
     * @required
     */
    accessToken: string;
};
