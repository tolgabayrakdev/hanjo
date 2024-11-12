import { PoolClient } from 'pg';
import pool from '../config/database';

class TaskRepository {
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

    async create(
        id: number,
        task: {
            title: string;
            description: string;
            status: string;
            priority: string;
            dueDate: string;
        },
    ) {
        const query = `INSERT INTO tasks (title, description, status, priority, due_date, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
        const result = await pool.query(query, [
            task.title,
            task.description,
            task.status,
            task.priority,
            task.dueDate,
            id,
        ]);
        return result.rows[0];
    }

    async update(
        id: number,
        task: {
            title: string;
            description: string;
            status: string;
            priority: string;
            dueDate: string;
        },
    ) {
        const query = `UPDATE tasks SET title = $1, description = $2, status = $3, priority = $4, due_date = $5 WHERE id = $4 RETURNING *`;
        const result = await pool.query(query, [
            task.title,
            task.description,
            task.status,
            task.priority,
            task.dueDate,
            id,
        ]);
        return result.rows[0];
    }

    async delete(id: number) {
        const query = `DELETE FROM tasks WHERE id = $1`;
        await pool.query(query, [id]);
    }

    async getTaskById(id: number) {
        const query = `SELECT * FROM tasks WHERE id = $1`;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    async getAllTasks(id: number) {
        const query = `SELECT * FROM tasks WHERE user_id = $1`;
        const result = await pool.query(query, [id]);
        return result.rows;
    }
}

export default TaskRepository;
