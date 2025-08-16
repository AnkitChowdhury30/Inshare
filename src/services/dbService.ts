import { MongoClient, Db } from "mongodb";

const MONGODB_URI = process.env.ENV_MONGODB_URI;
const DB_NAME = process.env.ENV_DB_NAME;

if (!MONGODB_URI || !DB_NAME) {
    console.log("ENV_MONGODB_URI or ENV_DB_NAME not found");
    throw new Error("ENV_MONGODB_URI or ENV_DB_NAME not set in environment variables");
}

let client: MongoClient;
let db: Db;
let connecting: Promise<Db> | null = null;
export const connectToDb = async (): Promise<Db> => {
    if (db) return db;
    if (connecting) return connecting;

    connecting = (async () => {
        try {
            console.log("🔗 Connecting to MongoDB...");
            client = new MongoClient(MONGODB_URI);
            await client.connect();
            db = client.db(DB_NAME);
            console.log("✅ Connected to MongoDB");
            return db;
        } catch (err) {
            console.error("❌ MongoDB connection failed:", err);
            connecting = null; // allow retry in future calls
            throw err;
        }
    })();

    return connecting;
};

export const closeDb = async (): Promise<void> => {
    if (client) {
        await client.close();
        console.log("🔌 MongoDB connection closed");
    }
};
