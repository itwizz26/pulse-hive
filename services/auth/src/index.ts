import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { errorHandler } from './middleware/errorHandler';
import healthRoutes from './routes/healthRoutes';
import authRoutes from './routes/authRoutes';

const app = express();
const PORT = Number(process.env.PORT) || 4003;

// Basic Middleware
app.use(helmet()); // Security headers
app.use(cors());   // Handle cross-origin requests
app.use(express.json()); // Parse incoming JSON payloads

// Routes
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/auth', authRoutes);

// MUST be after routes
app.use(errorHandler);

// Add a startup check for Env Vars
if (!process.env.JWT_SECRET) {
    throw new Error('FATAL ERROR: JWT_SECRET is not defined.');
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Auth Service running on port ${PORT}`);
});