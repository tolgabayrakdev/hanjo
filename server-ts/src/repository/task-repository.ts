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
            title?: string;
            description?: string;
            status?: string;
            priority?: string;
            dueDate?: string;
        },
    ) {
        const updates = Object.entries(task)
            .filter(([_, value]) => value !== undefined)
            .map(([key, value]) => {
                const columnName = key === 'dueDate' ? 'due_date' : key.toLowerCase();
                return { columnName, value };
            });

        // Eğer güncellenecek alan yoksa null dön
        if (updates.length === 0) {
            return null;
        }

        const setStatements = updates
            .map((update, index) => `${update.columnName} = $${index + 1}`)
            .join(', ');

        const query = `
        UPDATE tasks 
        SET ${setStatements} 
        WHERE id = $${updates.length + 1} 
        RETURNING *
    `;

        // Query parametrelerini hazırla
        const values = [...updates.map(update => update.value), id];
        const result = await pool.query(query, values);
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
