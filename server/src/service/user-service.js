import HttpException from '../exceptions/http-exception.js';

class UserService {
    constructor(userRepository){
        this.userRepository = userRepository
    }

    async createUser(user){
        try {
            const newUser = await this.userRepository.createUser(user);
            return newUser;
           
        } catch (error) {
            if (client) {
                await this.userRepository.rollbackTransaction(client);
            }
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(500, error.message);
        }
    }

    async updateUser(id, user){
        let client;
        try {
            client = await this.userRepository.beginTransaction();
            const result = await this.userRepository.update(id, user, client);
            await this.userRepository.commitTransaction(client);
            return result;
        } catch (error) {
            if (client) {
                await this.userRepository.rollbackTransaction(client);
            }
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(500, error.message);
        }
    }

    async getAllUsers(){
        return this.userRepository.getAllUsers();
    }

    async getUserById(id){
        return this.userRepository.getUserById(id);
    }

    async deleteUser(id){
        return this.userRepository.delete(id);
    }
}

export default UserService;