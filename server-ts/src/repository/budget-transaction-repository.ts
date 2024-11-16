import { PoolClient } from 'pg';
import pool from '../config/database';

type Transaction = {
    budget_id: number;
    type: 'income' | 'expense';
    amount: number;
    category: string;
    description?: string;
};

class BudgetTransactionRepository {
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

    async create(budget_id: number, transaction: Transaction) {
        const query = `INSERT INTO transactions (budget_id, type, amount, category, description) VALUES ($1, $2, $3, $4) RETURNING *`;
        const result = await pool.query(query, [
            budget_id,
            transaction.type,
            transaction.amount,
            transaction.category,
            transaction.description || null,
        ]);
        return result.rows[0];
    }

    async deposit(
        budget_id: number,
        amount: number,
        category: string,
        description?: string,
    ) {
        const query = `INSERT INTO transactions (budget_id, type, amount, category, description) VALUES ($1, 'income', $2, $3, $4) RETURNING *`;
        const result = await pool.query(query, [
            budget_id,
            amount,
            category,
            description || null,
        ]);
        return result.rows[0];
    }

    async withdraw(
        budget_id: number,
        amount: number,
        category: string,
        description?: string,
    ){
        const query = `INSERT INTO transactions (budget_id, type, amount, category, description) VALUES ($1, 'expense', $2, $3, $4) RETURNING *`;
        const result = await pool.query(query, [
            budget_id,
            amount,
            category,
            description || null,
        ]);
        return result.rows[0];
    }

    async getTransactionById(id: number) {
        const query = `SELECT * FROM budgets WHERE id = $1`;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    async getAllTransactions(id: number) {
        const query = `SELECT * FROM budgets WHERE user_id = $1`;
        const result = await pool.query(query, [id]);
        return result.rows;
    }
}

export default BudgetTransactionRepository;
