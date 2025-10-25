import dotenv from 'dotenv';
import express from 'express';
import { AppDataSource, ensureDatabase, initializeDatabase } from './configs/AppDataSource';

// Load environment variables
dotenv.config({ override: true });

// Create Express app
const app = express();


// Main startup sequence
(async () => {
  try {
    // Ensure database exists
    await ensureDatabase();
    await initializeDatabase(AppDataSource);

    const feedbackController = require('./controllers/feedbacks').default;

    app.post('/api/feedback', feedbackController);

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
})();
