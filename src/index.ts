import { app } from './app';
import { SETTINGS } from './app-settings';
import { connectToDatabase } from './database/mongoDB';

const dbName = process.env.DB_NAME_PROD || SETTINGS.DB_NAMES.DEV;

app.listen(SETTINGS.PORT, async () => {
    const isConnected = await connectToDatabase(SETTINGS.MONGO_URL, dbName);

    if (!isConnected) {
        console.log('MongoDB connection closed.');
        return process.exit(1);
    }

    console.log(`...server started in port ${SETTINGS.PORT}`);
});
