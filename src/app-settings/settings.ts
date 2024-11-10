import { config } from 'dotenv';
config(); // Loads .env file contents into process.env by default.

export const SETTINGS = {
    PORT: process.env.PORT || 3003,
    PATH: {
        BLOGS: '/blogs',
        POSTS: '/posts',
        TESTING: '/testing/all-data',
    },
    LOGIN: process.env.LOGIN,
    PASSWORD: process.env.PASSWORD,
};
