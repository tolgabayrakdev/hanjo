import pg from 'pg';
const { Pool } = pg;

class UserRepository {
    constructor(){
        this.pool = new Pool({
            user: 'root',
            host: 'localhost',
            database: 'postgres',
            password: 'root',
            port: 5432,
        });
    }

    async create(user) {
        const query = `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *`;
        const result = await this.pool.query(query, [user.username, user.email, user.password]);
        return result.rows[0];
    }

    async delete(id) {
        const query = `DELETE FROM users WHERE id = $1`;
        await this.pool.query(query,[id]);
    }

    async getUserById(id) {
        const query = `SELECT * FROM users WHERE id = $1`;
        const result = await this.pool.query(query, [id]);
        return result.rows[0];
    }

    async getAllUsers() {
        const query = `SELECT * FROM users`;
        const result = await this.pool.query(query);
        return result.rows;
    }

    async update(id, user) {
        const query = `UPDATE users SET username = $1, email = $2, password = $3 WHERE id = $4 RETURNING *`;
        const result = await this.pool.query(query, [user.username, user.email, user.password, id]);
        return result.rows[0];
    }
}

export default UserRepository;