import express, { Request, Response } from 'express';
import userRoutes from './routes/userRoutes.js';

const app = express();
const PORT = 5000;

// 🔌 Global Middleware
app.use(express.json());

// 🏠 Base Home Route
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Consultly API Server! 🚀');
});

// 🔌 Connect Our Modular Router Pipelines
// This prefixes all routes inside userRoutes with '/api/v1/users'
app.use('/api/v1/users', userRoutes);

// 🚀 Boot up the server engine
app.listen(PORT, () => {
  console.log(`Server is running beautifully at http://localhost:${PORT}`);
});