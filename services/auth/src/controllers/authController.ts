import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { db } from '../db';

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password, ownerName } = req.body;
        const hashedPassword = await AuthService.hashPassword(password);
        
        const user = await db.user.create({
            data: { email, passwordHash: hashedPassword }
        });

        const token = AuthService.signToken(user.id);
        res.status(201).json({ user: { id: user.id, email: user.email }, token });
    } catch (error) {
        next(error);
    }
};

// Add this function to satisfy the import
export const login = async (req: Request, res: Response, next: NextFunction) => {
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