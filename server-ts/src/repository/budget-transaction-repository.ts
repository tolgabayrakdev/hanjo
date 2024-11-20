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
        const query = `INSERT INTO transactions (budget_id, type, amount, category, description) 
                      VALUES ($1, 'income', $2, $3, $4) RETURNING *`;
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
    ) {
        const query = `INSERT INTO transactions (budget_id, type, amount, category, description) 
                      VALUES ($1, 'expense', $2, $3, $4) RETURNING *`;
        const result = await pool.query(query, [
            budget_id,
            amount,
            category,
            description || null,
        ]);
        return result.rows[0];
    }

    async getTransactionById(id: number) {
        const query = `SELECT * FROM transactions WHERE id = $1`;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    async getAllTransactions(budget_id: number) {
        const query = `SELECT * FROM transactions WHERE budget_id = $1`;
        const result = await pool.query(query, [budget_id]);
        return result.rows;
    }

    async updateBudgetAmount(amount: number, budget_id: number, client?: PoolClient) {
        const query = `
            UPDATE budgets 
            SET amount = amount + $1 
            WHERE id = $2 
            RETURNING *
        `;
        const queryExecutor = client || pool;
        const result = await queryExecutor.query(query, [amount, budget_id]);
        return result.rows[0];
    }

    async checkBudgetBalance(budget_id: number, amount: number) {
        const query = `SELECT amount FROM budgets WHERE id = $1`;
        const result = await pool.query(query, [budget_id]);
        const budget = result.rows[0];

        if (!budget) {
            throw new Error('Bütçe bulunamadı');
        }

        if (budget.amount < amount) {
            throw new Error('Yetersiz bakiye');
        }

        return true;
    }
}

export default BudgetTransactionRepository;
