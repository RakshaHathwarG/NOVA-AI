
const mongoose = require('mongoose');
const dns = require('dns');

// Use alternative DNS servers for MongoDB Atlas SRV lookups.
dns.setServers(['8.8.8.8', '1.1.1.1']);
dns.setDefaultResultOrder('ipv4first');

async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error('MongoDB connection failed: MONGO_URI is missing from .env');
    return false;
  }

  try {
    // Safely display connection details without revealing the password.
    const parsedUri = new URL(uri);

    console.log('MongoDB host:', parsedUri.hostname);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error('MongoDB connection failed:', error.name || 'ConnectionError');

    if (
      error.message.includes('bad auth') ||
      error.message.includes('authentication failed')
    ) {
      console.error(
        'Check the database username and password in backend/.env.'
      );
    } else if (
      error.message.includes('ECONNREFUSED') ||
      error.message.includes('querySrv')
    ) {
      console.error(
        'MongoDB Atlas DNS lookup failed. Check your DNS and network.'
      );
    } else if (
      error.message.includes('IP') ||
      error.message.includes('whitelist') ||
      error.message.includes('not authorized')
    ) {
      console.error(
        'Check Atlas Network Access and database-user permissions.'
      );
    }

    return false;
  }
}

module.exports = connectDB;
