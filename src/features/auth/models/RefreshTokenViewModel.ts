/**
 * Represents the view model for a successful token refresh response,
 * containing a new access token for continued authorization.
 */
export type RefreshTokenViewModel = {
    /**
     * The new access token issued upon successful token refresh.
     * This token should replace the previous one in the Authorization header of subsequent requests.
     * @type {string}
     * @required
     */
    accessToken: string;
};
