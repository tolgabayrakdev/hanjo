import { PoolClient } from 'pg';
import pool from '../config/database';

class ContactRepository {
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
        contact: {
            name: string;
            surname: string;
            email: string;
            phone_number: string;
        },
    ) {
        const query = `INSERT INTO contacts (name, surname, email, phone_number, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
        const result = await pool.query(query, [
            contact.name,
            contact.surname,
            contact.email,
            contact.phone_number,
            id,
        ]);
        return result.rows[0];
    }

    async update(
        id: number,
        contact: {
            name?: string;
            surname?: string;
            email?: string;
            phone_number?: string;
        },
    ) {
        const updates = Object.entries(contact)
            .filter(([_, value]) => value !== undefined)
            .map(([key]) => ({
                columnName: key.toLowerCase(),
                value: contact[key as keyof typeof contact],
            }));

        // Eğer güncellenecek alan yoksa null dön
        if (updates.length === 0) {
            return null;
        }

        const setStatements = updates
            .map((update, index) => `${update.columnName} = $${index + 1}`)
            .join(', ');

        const query = `
        UPDATE contacts 
        SET ${setStatements} 
        WHERE id = $${updates.length + 1} 
        RETURNING *
    `;

        const values = [...updates.map((update) => update.value), id];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    async delete(id: number) {
        const query = `DELETE FROM contacts WHERE id = $1`;
        await pool.query(query, [id]);
    }

    async getContactById(id: number) {
        const query = `SELECT * FROM contacts WHERE id = $1`;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    async getAllContacts(id: number) {
        const query = `SELECT * FROM contacts WHERE user_id = $1`;
        const result = await pool.query(query, [id]);
        return result.rows;
    }
}

export default ContactRepository;
