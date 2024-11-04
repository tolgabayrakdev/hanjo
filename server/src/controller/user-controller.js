import HttpException from '../exceptions/http-exception.js';

class UserController {
    constructor(userService) {
        this.userService = userService
    }

    async createUser(req, res) {
        try {
            const user = await this.userService.createUser(req.body);
            res.status(201).json(user);
        } catch (error) {
            if (error instanceof HttpException) {
                res.status(error.status).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    async getAllUsers(req, res) {
        try {
            const result = await this.userService.getAllUsers()
            res.status(200).json(result)
        } catch (error) {
            if (error instanceof HttpException) {
                res.status(error.status).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    async getUserById(req, res) {
        try {
            const id = req.params.id
            const result = await this.userService.getUserById(id)
            if (!result) {
                throw new HttpException(404, 'Kullanıcı bulunamadı');
            }
            res.status(200).json(result)
        } catch (error) {
            if (error instanceof HttpException) {
                res.status(error.status).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    async deleteUser(req, res) {
        try {
            const result = await this.userService.deleteUser(req.params.id);
            if (!result) {
                throw new HttpException(404, 'Kullanıcı bulunamadı');
            }
            res.status(204).send();
        } catch (error) {
            if (error instanceof HttpException) {
                res.status(error.status).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    async updateUser(req, res) {
        try {
            const id = req.params.id
            const user = req.body
            const result = await this.userService.updateUser(id, user)
            if (!result) {
                throw new HttpException(404, 'Kullanıcı bulunamadı');
            }
            res.status(200).json(result)
        } catch (error) {
            if (error instanceof HttpException) {
                res.status(error.status).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }
}

export default UserController;