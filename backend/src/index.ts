import express, { Request, Response } from 'express';
import prisma from './db.js'; // 👈 Import our Prisma instance (add .js for ESM resolution)

const app = express();
const PORT = 5000;

app.use(express.json());

// 🏠 GET Route (Home)
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Consultly API Server! 🚀');
});

// 💾 POST Route: Registers a User directly to the Live SQLite Database
app.post('/api/v1/users/register', async (req: Request, res: Response) => {
  try {
    const { name, email, role } = req.body;

    // 1. Basic validation check
    if (!name || !email || !role) {
      return res.status(400).json({ error: 'All fields (name, email, role) are required.' });
    }

    // 2. Insert the user data into the database via Prisma
    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        role: role,
      },
    });

    // 3. Return the saved database user object back to Postman
    res.status(201).json({
      message: 'User successfully saved to database! 🎉',
      user: newUser,
    });
    
  } catch (error: any) {
    // Handle database constraint issues (e.g., if the email already exists)
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'An account with this email already exists!' });
    }
    
    console.error('Database Error:', error);
    res.status(500).json({ error: 'Something went wrong inside the server.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running beautifully at http://localhost:${PORT}`);
});