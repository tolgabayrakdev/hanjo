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

    async userUpdate(user: { username: string; email: string; password: string }) {
        const query = `
            INSERT INTO users (username, email, password, role_id) 
            VALUES ($1, $2, $3, 1) 
            RETURNING id, username, email, role_id`;
        const result = await pool.query(query, [user.username, user.email, user.password]);
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
