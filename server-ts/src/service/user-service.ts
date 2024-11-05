import HttpException from '../exceptions/http-exception';
import UserRepository from '../repository/user-repository';
import { PoolClient } from 'pg';

class UserService {

    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }


    async createUser(user: { username: string; email: string; password: string; }) {
        let client: PoolClient | null = null;
        try {
            client = await this.userRepository.beginTransaction();
            const newUser = await this.userRepository.create(user);
            await this.userRepository.commitTransaction(client);
            return newUser;
    
        } catch (error) {
            if (client) {
                await this.userRepository.rollbackTransaction(client);
            }
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(500, (error as Error).message);
        }
    }

    async updateUser(id: number, user: { username: string; email: string; password: string; }) {
        let client;
        try {
            client = await this.userRepository.beginTransaction();
            const result = await this.userRepository.update(id, user);
            await this.userRepository.commitTransaction(client);
            return result;
        } catch (error) {
            if (client) {
                await this.userRepository.rollbackTransaction(client);
            }
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(500, (error as Error).message);
        }
    }

    async getAllUsers() {
        return this.userRepository.getAllUsers();
    }

    async getUserById(id: number) {
        return this.userRepository.getUserById(id);
    }

    async deleteUser(id: number) {
        return this.userRepository.delete(id);
    }
}

export default UserService;