import { PoolClient } from 'pg';
import pool from '../config/database';

class UserRepository {
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

    async create(user: { username: string; email: string; password: string }) {
        const query = `INSERT INTO users (username, email, password, role_id) VALUES ($1, $2, $3, 1) RETURNING *`;
        const result = await pool.query(query, [user.username, user.email, user.password]);
        return result.rows[0];
    }

    async update(id: number, user: { username: string; email: string; password: string }) {
        const query = `UPDATE users SET username = $1, email = $2, password = $3 WHERE id = $4 RETURNING *`;
        const result = await pool.query(query, [user.username, user.email, user.password, id]);
        return result.rows[0];
    }

    async delete(id: number) {
        const query = `DELETE FROM users WHERE id = $1`;
        await pool.query(query, [id]);
    }

    async getUserById(id: number) {
        const query = `SELECT * FROM users WHERE id = $1`;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    async findByEmail(email: string) {
        const query = `SELECT * FROM users WHERE email = $1`;
        const result = await pool.query(query, [email]);
        return result.rows[0];
    }

    async findByUsername(username: string) {
        const query = `SELECT * FROM users WHERE username = $1`;
        const result = await pool.query(query, [username]);
        return result.rows[0];
    }

    async getAllUsers() {
        const query = `SELECT * FROM users`;
        const result = await pool.query(query);
        return result.rows;
    }
}

export default UserRepository;
