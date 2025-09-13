const { MongoClient } = require('mongodb');

const MONGODB_URI = "mongodb+srv://tabu-admin:7JgNDMAM1sRvEjcy@cluster0.27erlhk.mongodb.net/tabu?retryWrites=true&w=majority&appName=Cluster0";

async function testConnection() {
    console.log('🔄 Testing MongoDB connection...');
    console.log('Connection URI:', MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
    
    try {
        console.log('⏳ Attempting to connect...');
        const client = new MongoClient(MONGODB_URI, {
            serverSelectionTimeoutMS: 10000, // 10 second timeout
            connectTimeoutMS: 10000,
        });
        
        await client.connect();
        console.log('✅ MongoDB connected successfully!');
        
        // Test database operations
        const db = client.db("tabu");
        console.log('📊 Database name:', db.databaseName);
        
        // List collections
        const collections = await db.listCollections().toArray();
        console.log('📋 Collections:', collections.map(c => c.name));
        
        await client.close();
        console.log('🔌 Connection closed');
        
    } catch (error) {
        console.error('❌ MongoDB connection failed:');
        console.error('Error type:', error.name);
        console.error('Error message:', error.message);
        
        if (error.message.includes('ETIMEDOUT')) {
            console.log('\n🔧 SOLUTION STEPS:');
            console.log('1. Check MongoDB Atlas IP whitelist');
            console.log('2. Ensure cluster is not sleeping/paused');
            console.log('3. Check your internet connection');
            console.log('4. Try adding 0.0.0.0/0 to IP whitelist temporarily');
        }
        
        if (error.message.includes('authentication')) {
            console.log('\n🔧 AUTHENTICATION ISSUE:');
            console.log('1. Check username and password in connection string');
            console.log('2. Verify user has correct permissions');
        }
    }
}

testConnection(); 