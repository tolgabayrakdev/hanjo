import Crypto from 'crypto';
import Jwt from 'jsonwebtoken';

export class Helper {
    public generateAccessToken(payload: object) {
        return Jwt.sign(payload, process.env.JWT_SECRET_KEY || 'Secret_Key', {
            expiresIn: '1h',
        });
    }

    public generateRefreshToken(payload: object) {
        return Jwt.sign(payload, process.env.JWT_SECRET_KEY || 'Secret_Key', {
            expiresIn: '7d',
        });
    }

    public hashPassword(payload: string) {
        return Crypto.createHash('sha256').update(payload).digest('base64');
    }

    public decodeToken(payload: string) {
        try {
            const decodedToken = Jwt.verify(
                payload,
                process.env.JWT_SECRET_KEY || 'Secret_Key',
            );
            return decodedToken;
        } catch {
            throw new Error('Error!, Token has not decoded!');
        }
    }

    public comparePassword(plainPassword: string, hashedPassword: string): boolean {
        const hashedPlainPassword = this.hashPassword(plainPassword);
        return hashedPlainPassword === hashedPassword;
    }
}