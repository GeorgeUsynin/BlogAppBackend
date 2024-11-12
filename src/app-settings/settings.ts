import { config } from 'dotenv';
config(); // Loads .env file contents into process.env by default.

const DEFAULT_PORT = 3003;

export const SETTINGS = {
    PORT: process.env.PORT || DEFAULT_PORT,
    CREDENTIALS: {
        LOGIN: process.env.LOGIN,
        PASSWORD: process.env.PASSWORD,
    },
};
