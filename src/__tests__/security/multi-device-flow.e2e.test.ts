import { dbHelper, getAuthorization, request } from '../test-helpers';
import { HTTP_STATUS_CODES, ROUTES } from '../../constants';

import { AuthDeviceViewModel } from '../../features/security/api/models';

const userAgents = [
    {
        'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.5845.96 Safari/537.36',
    },
    {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7; rv:118.0) Gecko/20100101 Firefox/118.0',
    },
    {
        'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.5845.96 Safari/537.36 Edg/116.0.1938.69',
    },
    {
        'User-Agent':
            'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    },
];

describe('multi device flow', () => {
    beforeAll(async () => {
        await dbHelper.connectToDb();
    });

    afterAll(async () => {
        await dbHelper.dropDb();
        await dbHelper.closeConnection();
    });

    /**
     * Scenario:
     * Creating a user, login in the user 4 times with different user-agents;
     * Updating the refreshToken of the device 1;
     * Requesting a list of devices with an updated token. The number of devices and the DeviceID of all devices should not change. LastActiveDate of the 1 device should change;
     * Deleting device 2 (passing the refreshToken of device 1). Requesting a list of devices. We check that the device 2 is missing from the list.;
     * We make a logout with device 3. We request a list of devices (using device 1). There should be no device 3 in the list.;
     * Delete all remaining devices (with device 1).  Requesting a list of devices. The list should contain only one (current) device.;
     */

    it('scenario', async () => {
        //create new user
        const newUser = {
            login: 'angiejo03',
            password: '12345678',
            email: 'angie@example.com',
        };

        await request.post(ROUTES.USERS).set(getAuthorization()).send(newUser).expect(HTTP_STATUS_CODES.CREATED_201);

        const credentials = {
            loginOrEmail: 'angiejo03',
            password: '12345678',
        };

        const loginResponses = [];

        // login user from 4 different devices
        for (let userAgent of userAgents) {
            const response = await request
                .post(`${ROUTES.AUTH}${ROUTES.LOGIN}`)
                .set(userAgent)
                .send(credentials)
                .expect(HTTP_STATUS_CODES.OK_200);

            loginResponses.push(response);
        }

        const firstLoginRefreshTokenMatch = loginResponses[0].headers['set-cookie'][0].match(/refreshToken=([^;]+)/);
        const firstLoginRefreshToken = firstLoginRefreshTokenMatch?.[1] as string;
        const firstLoginRefreshTokenCookie = {
            Cookie: [`refreshToken=${firstLoginRefreshToken}; Path=/; HttpOnly; Secure`],
        };

        const { body: devices }: { body: AuthDeviceViewModel[] } = await request
            .get(`${ROUTES.SECURITY}${ROUTES.DEVICES}`)
            .set(firstLoginRefreshTokenCookie)
            .expect(HTTP_STATUS_CODES.OK_200);

        //update refreshToken of the first device
        const response = await request
            .post(`${ROUTES.AUTH}${ROUTES.REFRESH_TOKEN}`)
            .set(firstLoginRefreshTokenCookie)
            .expect(HTTP_STATUS_CODES.OK_200);

        const updatedFirstLoginRefreshTokenMatch = response.headers['set-cookie'][0].match(/refreshToken=([^;]+)/);
        const updatedFirstLoginRefreshToken = updatedFirstLoginRefreshTokenMatch?.[1] as string;
        const updatedFirstLoginRefreshTokenCookie = {
            Cookie: [`refreshToken=${updatedFirstLoginRefreshToken}; Path=/; HttpOnly; Secure`],
        };

        const { body: secondFetchDevices }: { body: AuthDeviceViewModel[] } = await request
            .get(`${ROUTES.SECURITY}${ROUTES.DEVICES}`)
            .set(updatedFirstLoginRefreshTokenCookie)
            .expect(HTTP_STATUS_CODES.OK_200);

        //devices amount should be equal for the first and second query
        expect(secondFetchDevices.length).toBe(devices.length);
        expect(devices.map(device => device.deviceId)).toEqual(secondFetchDevices.map(device => device.deviceId));
        expect(devices[0].lastActiveDate).not.toBe(secondFetchDevices[0].lastActiveDate);

        // remove second device
        await request
            .delete(`${ROUTES.SECURITY}${ROUTES.DEVICES}/${secondFetchDevices[1].deviceId}`)
            .set(updatedFirstLoginRefreshTokenCookie)
            .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

        const { body: thirdFetchDevices }: { body: AuthDeviceViewModel[] } = await request
            .get(`${ROUTES.SECURITY}${ROUTES.DEVICES}`)
            .set(updatedFirstLoginRefreshTokenCookie)
            .expect(HTTP_STATUS_CODES.OK_200);

        //devices left = 3
        expect(thirdFetchDevices.length).toBe(3);
        //second device is not in the list
        expect(thirdFetchDevices.map(device => device.deviceId)).not.toContain(secondFetchDevices[1].deviceId);

        //logout using third device
        const thirdLoginRefreshTokenMatch = loginResponses[2].headers['set-cookie'][0].match(/refreshToken=([^;]+)/);
        const thirdLoginRefreshToken = thirdLoginRefreshTokenMatch?.[1] as string;
        const thirdLoginRefreshTokenCookie = {
            Cookie: [`refreshToken=${thirdLoginRefreshToken}; Path=/; HttpOnly; Secure`],
        };

        await request
            .post(`${ROUTES.AUTH}${ROUTES.LOGOUT}`)
            .set(thirdLoginRefreshTokenCookie)
            .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

        const { body: forthFetchDevices }: { body: AuthDeviceViewModel[] } = await request
            .get(`${ROUTES.SECURITY}${ROUTES.DEVICES}`)
            .set(updatedFirstLoginRefreshTokenCookie)
            .expect(HTTP_STATUS_CODES.OK_200);

        expect(forthFetchDevices.length).toBe(2);
        expect(forthFetchDevices.map(device => device.deviceId)).not.toContain(devices[2].deviceId);

        // remove rest devices
        await request
            .delete(`${ROUTES.SECURITY}${ROUTES.DEVICES}`)
            .set(updatedFirstLoginRefreshTokenCookie)
            .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

        const { body: fifthFetchDevices }: { body: AuthDeviceViewModel[] } = await request
            .get(`${ROUTES.SECURITY}${ROUTES.DEVICES}`)
            .set(updatedFirstLoginRefreshTokenCookie)
            .expect(HTTP_STATUS_CODES.OK_200);

        expect(fifthFetchDevices.length).toBe(1);
        expect(fifthFetchDevices[0].deviceId).toBe(devices[0].deviceId);
    });
});
