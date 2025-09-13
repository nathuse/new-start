// Load environment variables
require('dotenv').config();
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://tabu-admin:7JgNDMAM1sRvEjcy@cluster0.27erlhk.mongodb.net/tabu?retryWrites=true&w=majority&appName=Cluster0";

console.log('📋 Environment Check:');
console.log(`   - MONGODB_URI from .env: ${process.env.MONGODB_URI ? '✅ FOUND' : '❌ NOT FOUND'}`);
console.log(`   - Using: ${MONGODB_URI.substring(0, 30)}...`);

async function quickTest() {
    console.log('🔄 Quick MongoDB test...');
    
    try {
        console.log('⏳ Connecting to MongoDB Atlas...');
        const client = new MongoClient(MONGODB_URI, {
            serverSelectionTimeoutMS: 15000,
            connectTimeoutMS: 15000,
        });
        
        await client.connect();
        console.log('✅ MongoDB connection successful!');
        
        // Test database access
        const db = client.db("tabu");
        const collections = await db.listCollections().toArray();
        console.log(`📊 Database accessible. Found ${collections.length} collections.`);
        
        await client.close();
        console.log('🎉 Test completed successfully!');
        
    } catch (error) {
        console.log('❌ Connection failed:');
        console.log('Error:', error.message);
        
        if (error.message.includes('timed out')) {
            console.log('\n💡 Solution: Add your IP address (102.213.68.56) to MongoDB Atlas Network Access');
            console.log('   1. Go to https://cloud.mongodb.com/');
            console.log('   2. Navigate to Network Access');
            console.log('   3. Click "Add IP Address"');
            console.log('   4. Add: 102.213.68.56');
            console.log('   5. Wait 2-3 minutes and try again');
        }
    }
}

quickTest(); 