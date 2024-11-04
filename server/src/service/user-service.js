import HttpException from '../exceptions/http-exception.js';

class UserService {
    constructor(userRepository){
        this.userRepository = userRepository
    }

    async createUser(user){
        try {
            // Email kontrolü
            const existingEmail = await this.userRepository.findByEmail(user.email);
            if (existingEmail) {
                throw new HttpException(400, 'Bu email adresi zaten kullanımda');
            }
            return await this.userRepository.create(user);
        } catch (error) {
            throw new HttpException(500, error.message);
        }
    }

    async getAllUsers(){
        return this.userRepository.getAllUsers()
    }

    async getUserById(id){
        return this.userRepository.getUserById(id)
    }

    async deleteUser(id){
        return this.userRepository.delete(id)
    }

    async updateUser(id, user){
        return this.userRepository.update(id, user)
    }
}

export default UserService;