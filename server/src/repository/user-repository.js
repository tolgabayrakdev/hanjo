class UserRepository {
    constructor(pool) {
        if (!pool) {
            throw new Error('Database pool is required');
        }
        this.pool = pool;
    }

    async beginTransaction() {
        const client = await this.pool.connect();
        await client.query('BEGIN');
        return client;
    }

    async commitTransaction(client) {
        await client.query('COMMIT');
        client.release();
    }

    async rollbackTransaction(client) {
        await client.query('ROLLBACK');
        client.release();
    }

    async create(user, client = this.pool) {
        const query = `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *`;
        const result = await client.query(query, [user.username, user.email, user.password]);
        return result.rows[0];
    }

    async update(id, user, client = this.pool) {
        const query = `UPDATE users SET username = $1, email = $2, password = $3 WHERE id = $4 RETURNING *`;
        const result = await client.query(query, [user.username, user.email, user.password, id]);
        return result.rows[0];
    }

    async delete(id, client = this.pool) {
        const query = `DELETE FROM users WHERE id = $1`;
        await client.query(query, [id]);
    }

    async getUserById(id) {
        const query = `SELECT * FROM users WHERE id = $1`;
        const result = await this.pool.query(query, [id]);
        return result.rows[0];
    }

    async findByEmail(email) {
        const query = `SELECT * FROM users WHERE email = $1`;
        const result = await this.pool.query(query, [email]);
        return result.rows[0];
    }

    async findByUsername(username) {
        const query = `SELECT * FROM users WHERE username = $1`;
        const result = await this.pool.query(query, [username]);
        return result.rows[0];
    }

    async getAllUsers() {
        const query = `SELECT * FROM users`;
        const result = await this.pool.query(query);
        return result.rows;
    }
}

export default UserRepository;