import dotenv from 'dotenv';
import express from 'express';
import { AppDataSource, ensureDatabase, initializeDatabase } from './configs/AppDataSource';
import { setupSwagger } from './configs/Swagger';
import { localEnv } from './configs/EnvLoader';

// Load environment variables
dotenv.config({ override: true });

// Create Express app
const app = express();

setupSwagger(app);

// Main startup sequence
(async () => {
  try {
    // Ensure database exists
    await ensureDatabase();
    await initializeDatabase(AppDataSource);

    const feedbackController = require('./controllers/feedbacks').default;

    app.use('/api/feedback', feedbackController);

    app.listen(localEnv.Server.port, () => {
        console.log(`🚀 HTTP Server running on port ${localEnv.Server.port}`);
        console.log(`📚 Swagger UI at http://localhost:${localEnv.Server.port}/api-docs`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
})();
