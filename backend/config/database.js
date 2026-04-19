const mongoose = require('mongoose');

const LOCAL_MONGO_URI = 'mongodb://127.0.0.1:27017/personal-website';

const connectDB = async () => {
    const configuredUri = process.env.MONGO_URI;
    const mongoUri = configuredUri || LOCAL_MONGO_URI;

    const connect = async (uri) => {
        return mongoose.connect(uri, {
            serverSelectionTimeoutMS: 20000,
            retryWrites: true,
            w: 'majority'
        });
    };

    try {
        await connect(mongoUri);
        console.log(`✅ MongoDB Connected (${mongoUri.startsWith('mongodb+srv') ? 'Atlas' : 'Local'})`);
        return true;
    } catch (err) {
        console.error('❌ MongoDB Error:', err.message);

        if (configuredUri && mongoUri !== LOCAL_MONGO_URI) {
            console.log('➡️ Attempting fallback to local MongoDB...');
            try {
                await connect(LOCAL_MONGO_URI);
                        console.log('✅ Fallback Local MongoDB Connected');
                return true;
            } catch (fallbackErr) {
                console.error('❌ Local MongoDB Fallback Error:', fallbackErr.message);
            }
        }

        console.error('📌 Startup requires a working MongoDB connection.');
        console.error('   - Set a valid `MONGO_URI` in backend/.env');
        console.error('   - Or run a local MongoDB at 127.0.0.1:27017');
        process.exit(1);
    }
};

module.exports = connectDB;
