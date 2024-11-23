import { app } from './app';
import { SETTINGS } from './app-settings';
import { connectToDatabase } from './database/mongoDB';

const runExpressLongLifeServer = () => {
    app.listen(SETTINGS.PORT, async () => {
        const isConnected = await connectToDatabase(SETTINGS.MONGO_URL, SETTINGS.DB_NAME);

        if (!isConnected) {
            console.log('MongoDB connection closed.');
            return process.exit(1);
        }

        console.log(`...server started in port ${SETTINGS.PORT}`);
    });
};

if (process.env.VERCEL === '1') {
    console.log('Running on Vercel!');
} else {
    runExpressLongLifeServer();
}

export default app;
