import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { db } from '../db';
import bcrypt from 'bcrypt';

export const signup = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({ userId: user.id });
  } catch (error) {
    res.status(400).json({ error: 'User registration failed' });
  }
};

// Add this function to satisfy the import
export const signin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        
        // 1. Find user by email
        const user = await db.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // 2. Verify password
        const isValid = await AuthService.verifyPassword(password, user.passwordHash);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // 3. Generate Token
        const token = AuthService.signToken(user.id);
        res.status(200).json({ user: { id: user.id, email: user.email }, token });
    } catch (error) {
        next(error);
    }
};
