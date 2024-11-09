import { PoolClient } from 'pg';
import pool from '../config/database';

class UserActionRepository {
    async beginTransaction() {
        const client = await pool.connect();
        await client.query('BEGIN');
        return client;
    }

    async commitTransaction(client: PoolClient) {
        await client.query('COMMIT');
        client.release();
    }

    async rollbackTransaction(client: PoolClient) {
        await client.query('ROLLBACK');
        client.release();
    }

    async userUpdate(id: number, user: { username?: string; email?: string; password?: string }) {        
        const currentUser = await this.getUserById(id);
        if (!currentUser) {
            return null;
        }

        const updatedValues = {
            username: user.username || currentUser.username,
            email: user.email || currentUser.email,
            password: user.password || currentUser.password
        };

        const query = `
            UPDATE users 
            SET username = $1, email = $2, password = $3 
            WHERE id = $4 
            RETURNING id, username, email, role_id`;
        
        const result = await pool.query(query, [
            updatedValues.username,
            updatedValues.email,
            updatedValues.password,
            id
        ]);
        return result.rows[0];
    }

    async checkEmailExists(email: string, userId?: number) {
        const query = userId 
            ? `SELECT * FROM users WHERE email = $1 AND id != $2`
            : `SELECT * FROM users WHERE email = $1`;
        const params = userId ? [email, userId] : [email];
        const result = await pool.query(query, params);
        return result.rows.length > 0;
    }

    async changePassword(id: number, newPassword: string) {
        const query = `
            UPDATE users 
            SET password = $1 
            WHERE id = $2 
            RETURNING id, username, email`;
        const result = await pool.query(query, [newPassword, id]);
        return result.rows[0];
    }

    async getUserById(id: number) {
        const query = `SELECT * FROM users WHERE id = $1`;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    async deleteAccount(id: number) {
        const query = `DELETE FROM users WHERE id = $1 RETURNING id`;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }
}

export default UserActionRepository;
