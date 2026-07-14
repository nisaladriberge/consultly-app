import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../db.js';
import { RegisterUserSchema } from '../schemas/userSchema.js';

// 💾 1. Register a User
export const registerUser = async (req: Request, res: Response) => {
  try {
    const validatedData = RegisterUserSchema.parse(req.body);
    const { name, email, role } = validatedData;

    const newUser = await prisma.user.create({
      data: { name, email, role },
    });

    res.status(201).json({
      message: 'User successfully saved to database! 🎉',
      user: newUser,
    });
  } catch (error: any) {
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
};

// 🔍 2. Fetch ALL Users
export const getAllUsers = async (req: Request, res: Response) => {
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
};

// 🆔 3. Fetch a SINGLE User by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return res.status(404).json({ error: 'User profile not found.' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ error: 'Failed to retrieve user profile.' });
  }
};

// 🔄 4. Update a User
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = req.body || {};
    const { name, role } = body;

    const userExists = await prisma.user.findUnique({ where: { id } });
    if (!userExists) {
      return res.status(404).json({ error: 'User profile not found.' });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
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
};

// 🗑️ 5. Delete a User
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const userExists = await prisma.user.findUnique({ where: { id } });
    if (!userExists) {
      return res.status(404).json({ error: 'User profile not found.' });
    }

    await prisma.user.delete({ where: { id } });

    res.status(200).json({
      message: `User '${userExists.name}' has been deleted successfully. 🗑`
    });
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ error: 'Failed to delete user profile.' });
  }
};