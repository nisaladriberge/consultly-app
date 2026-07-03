import express, { Request, Response } from 'express';

const app = express();
const PORT = 5000;

// 1. Tell Express to use JSON middleware (This is the package inspector!)
app.use(express.json());

// Our original GET route
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Consultly API Server! 🚀');
});

// 2. Create a POST route to handle user registration (Simulation)
app.post('/api/v1/users/register', (req: Request, res: Response) => {
  // Extracting data sent by the user from req.body
  const { name, email, role } = req.body;

  // Let's print it to our backend terminal to verify we captured it
  console.log('Received registration data:', { name, email, role });

  // 3. Send a friendly response back to the client
  res.status(201).json({
    message: 'User registered successfully! 🎉',
    data: { name, email, role }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running beautifully at http://localhost:${PORT}`);
});