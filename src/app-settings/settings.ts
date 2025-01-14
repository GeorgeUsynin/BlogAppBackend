import { config } from 'dotenv';
config(); // Loads .env file contents into process.env by default.

const DEFAULT_PORT = 3003;
const DEFAULT_DB_NAME = 'guilds_dev';
const DEFAULT_MONGO_URL = 'mongodb://localhost:27017';

export const SETTINGS = {
    PORT: process.env.PORT || DEFAULT_PORT,
    CREDENTIALS: {
        LOGIN: process.env.LOGIN,
        PASSWORD: process.env.PASSWORD,
    },
    CODE_AUTH_BASE64: Buffer.from(`${process.env.LOGIN}:${process.env.PASSWORD}`, 'utf8').toString('base64'),
    MONGO_URL: process.env.MONGO_URL || DEFAULT_MONGO_URL,
    DB_NAME: process.env.DB_NAME_PROD || DEFAULT_DB_NAME,
    DB_COLLECTIONS: {
        apiRateLimitCollection: 'apiRateLimit',
        authDeviceSessionsCollection: 'authDeviceSessions',
        blogsCollection: 'blogs',
        likesCollection: 'likes',
        postsCollection: 'posts',
        commentsCollection: 'comments',
        usersCollection: 'users',
    },
    CONFIRMATION_CODE_EXPIRATION_TIME_IN_HOURS: 1,
    RECOVERY_CODE_EXPIRATION_TIME_IN_HOURS: 1,
    ACCESS_TOKEN_EXPIRATION_TIME: '10m',
    REFRESH_TOKEN_EXPIRATION_TIME: '1h',
    API_RATE_LIMIT_TIME_GAP_IN_MILLISECONDS: 10000,
    HASH_ROUNDS: 10,
};
