import pool from "../config/database";


class UserRepository {



    async create(user) {
        const query = `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *`;
        const result = await pool.query(query, [user.username, user.email, user.password]);
        return result.rows[0];
    }

    async update(id, user) {
        const query = `UPDATE users SET username = $1, email = $2, password = $3 WHERE id = $4 RETURNING *`;
        const result = await pool.query(query, [user.username, user.email, user.password, id]);
        return result.rows[0];
    }

    async delete(id) {
        const query = `DELETE FROM users WHERE id = $1`;
        await pool.query(query, [id]);
    }

    async getUserById(id) {
        const query = `SELECT * FROM users WHERE id = $1`;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    async findByEmail(email) {
        const query = `SELECT * FROM users WHERE email = $1`;
        const result = await pool.query(query, [email]);
        return result.rows[0];
    }

    async findByUsername(username) {
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