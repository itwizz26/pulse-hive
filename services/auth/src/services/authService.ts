import * as argon2 from 'argon2';
import jwt from 'jsonwebtoken';

export class AuthService {
    static async hashPassword(password: string): Promise<string> {
        return await argon2.hash(password);
    }

    static async verifyPassword(password: string, hash: string): Promise<boolean> {
        return await argon2.verify(hash, password);
    }

    static signToken(userId: string): string {
        return jwt.sign({ userId }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
    }
}