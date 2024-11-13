import { config } from 'dotenv';
config(); // Loads .env file contents into process.env by default.

const DEFAULT_PORT = 3003;

export const SETTINGS = {
    PORT: process.env.PORT || DEFAULT_PORT,
    CREDENTIALS: {
        LOGIN: process.env.LOGIN,
        PASSWORD: process.env.PASSWORD,
    },
    CODE_AUTH_BASE64: Buffer.from(`${process.env.LOGIN}:${process.env.PASSWORD}`, 'utf8').toString('base64'),
};
