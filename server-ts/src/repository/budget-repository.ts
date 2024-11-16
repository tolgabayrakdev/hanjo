import { PoolClient } from 'pg';
import pool from '../config/database';

class BudgetRepository {
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
        budget: {
            name: string;
            description: string;
            amount: number;
        },
    ) {
        const query = `INSERT INTO budgets (name, description, amount, user_id) VALUES ($1, $2, $3, $4) RETURNING *`;
        const result = await pool.query(query, [
            budget.name,
            budget.description,
            budget.amount,
            id
        ]);
        return result.rows[0];
    }

    async update(
        id: number,
        budget: {
            name?: string;
            description?: string;
            amount?: number;
        },
    ) {
        const updates = Object.entries(budget)
            .filter(([_, value]) => value !== undefined)
            .map(([key]) => ({
                columnName: key.toLowerCase(),
                value: budget[key as keyof typeof budget],
            }));

        if (updates.length === 0) {
            return null;
        }

        const setStatements = updates
            .map((update, index) => `${update.columnName} = $${index + 1}`)
            .join(', ');

        const query = `
        UPDATE budgets 
        SET ${setStatements} 
        WHERE id = $${updates.length + 1} 
        RETURNING *
    `;

        const values = [...updates.map((update) => update.value), id];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    async delete(id: number) {
        const query = `DELETE FROM budgets WHERE id = $1`;
        await pool.query(query, [id]);
    }

    async getBudgetById(id: number) {
        const query = `SELECT * FROM budgets WHERE id = $1`;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    async getAllBudgets(id: number) {
        const query = `SELECT * FROM budgets WHERE user_id = $1`;
        const result = await pool.query(query, [id]);
        return result.rows;
    }
}

export default BudgetRepository;
