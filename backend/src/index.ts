import express, { Request, Response } from 'express';
import prisma from './db.js';
import { z } from 'zod';

// 🛡️ Define a strict schema blueprint for registration input
const RegisterUserSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, { message: "Name cannot exceed 50 characters" }),
  email: z
    .string()
    .email({ message: "Invalid email address format" }),
  role: z
    .enum(['client', 'expert'], { message: "Role must be either 'client' or 'expert'" })
});

const app = express();
const PORT = 5000;

// 🔌 Intercept incoming JSON request flows globally
app.use(express.json());

// 🏠 GET Route (Home)
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Consultly API Server! 🚀');
});

// 💾 1. POST Route: Registers a User with strict Zod validation parsing
app.post('/api/v1/users/register', async (req: Request, res: Response) => {
  try {
    // Zod parses and strip-checks the payload instantly
    const validatedData = RegisterUserSchema.parse(req.body);

    // If validation runs perfectly, unpack the pristine, validated parameters
    const { name, email, role } = validatedData;

    const newUser = await prisma.user.create({
      data: { name, email, role },
    });

    res.status(201).json({
      message: 'User successfully saved to database! 🎉',
      user: newUser,
    });
    
  } catch (error: any) {
    // 🛡️ Rock-solid Zod error parser using the official .issues array
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.issues.map(issue => ({
          field: issue.path.join('.') || 'body',
          message: issue.message
        }))
      });
    }

    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'An account with this email already exists!' });
    }
    
    console.error('Database Error:', error);
    res.status(500).json({ error: 'Something went wrong inside the server.' });
  }
});

// 🔍 2. GET Route: Fetch ALL Users
app.get('/api/v1/users', async (req: Request, res: Response) => {
  try {
    const allUsers = await prisma.user.findMany();
    res.status(200).json({
      count: allUsers.length,
      users: allUsers
    });
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ error: 'Failed to retrieve users.' });
  }
});

// 🆔 3. GET Route: Fetch a SINGLE User by ID
app.get('/api/v1/users/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: id }
    });

    if (!user) {
      return res.status(404).json({ error: 'User profile not found.' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ error: 'Failed to retrieve user profile.' });
  }
});

// 🔄 4. PUT Route: Update an existing User's details
app.put('/api/v1/users/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const body = req.body || {};
    const { name, role } = body; 

    const userExists = await prisma.user.findUnique({
      where: { id: id }
    });

    if (!userExists) {
      return res.status(404).json({ error: 'User profile not found.' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: {
        name: name !== undefined ? name : userExists.name,
        role: role !== undefined ? role : userExists.role,
      }
    });

    res.status(200).json({
      message: 'Profile updated successfully! 🔄',
      user: updatedUser
    });
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ error: 'Failed to update user profile.' });
  }
});

// 🗑️ 5. DELETE Route: Delete a User permanently
app.delete('/api/v1/users/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const userExists = await prisma.user.findUnique({
      where: { id: id }
    });

    if (!userExists) {
      return res.status(404).json({ error: 'User profile not found.' });
    }

    await prisma.user.delete({
      where: { id: id }
    });

    res.status(200).json({
      message: `User '${userExists.name}' has been deleted successfully. 🗑️`
    });
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ error: 'Failed to delete user profile.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running beautifully at http://localhost:${PORT}`);
});