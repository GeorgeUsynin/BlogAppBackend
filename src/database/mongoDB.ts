import mongoose, { STATES, Mongoose } from 'mongoose';

export const connectToDatabase = async (url: string, dbName: string) => {
    let connection: Mongoose | null = null;
    let isConnected: boolean = false;

    if (isConnected && connection) {
        console.log('Database was restored from cache!');
        return { isConnected, connection };
    }

    try {
        const connection = await mongoose.connect(url, { dbName });
        isConnected = connection.STATES.connected === STATES.connected;
        return { isConnected, connection };
    } catch (err) {
        await mongoose.disconnect();
        console.dir(err);
        isConnected = false;
        return { isConnected, connection: null };
    }
};
