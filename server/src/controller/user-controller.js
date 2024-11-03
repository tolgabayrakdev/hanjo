class UserController {
    constructor(userService) {
        this.userService = userService
    }
    async createUser(req, res) {
        try {
            const user = await this.userService.createUser(req.body);
            res.status(201).json(user);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getAllUsers(req, res) {
        const result = await this.userService.getAllUsers()
        res.status(200).json(result)
    }
    async getUserById(req, res) {
        try {
            const id = req.params.id
            const result = await this.userService.getUserById(id)
            res.status(200).json(result)
        }
        catch (error) {
            res.status(404).json({ error: error.message })
        }

    }

    async deleteUser(req, res) {
        try {
            await this.userService.deleteUser(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    async updateUser(req, res) {
        const id = req.params.id
        const user = req.body
        const result = await this.userService.updateUser(id, user)
        res.status(200).json(result)
    }
}

export default UserController;