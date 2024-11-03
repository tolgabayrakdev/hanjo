class UserService {
    constructor(userRepository){
        this.userRepository = userRepository
    }
    async createUser(user){
        return this.userRepository.create(user)
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