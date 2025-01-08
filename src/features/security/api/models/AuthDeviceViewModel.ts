/**
 * Represents the input model for a device's authentication session.
 */
export type AuthDeviceViewModel = {
    /**
     * The IP address of the device during signing in.
     * This value is extracted from the request metadata.
     * @type {string}
     * @required
     */
    ip: string;

    /**
     * The name of the device used for signing in.
     * Typically derived by parsing the "User-Agent" HTTP header.
     * For example, "Chrome 105".
     * @type {string}
     * @required
     */
    title: string;

    /**
     * The date and time of the last refresh or generation of access tokens.
     * This is stored in ISO 8601 format.
     * @type {string}
     * @required
     */
    lastActiveDate: string;

    /**
     * The unique identifier for the device session.
     * Used to distinguish between multiple sessions of the same user.
     * @type {string}
     * @required
     */
    deviceId: string;
};
