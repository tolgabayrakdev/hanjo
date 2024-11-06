import HttpException from '../exceptions/http-exception';
import UserService from '../service/user-service';
import { Request, Response } from 'express';

class UserController {
    private userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    async createUser(req: Request, res: Response) {
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

    async getAllUsers(req: Request, res: Response) {
        try {
            const result = await this.userService.getAllUsers();
            res.status(200).json(result);
        } catch (error) {
            if (error instanceof HttpException) {
                res.status(error.status).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    async getUserById(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const result = await this.userService.getUserById(parseInt(id));
            if (!result) {
                throw new HttpException(404, 'Kullanıcı bulunamadı');
            }
            res.status(200).json(result);
        } catch (error) {
            if (error instanceof HttpException) {
                res.status(error.status).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    async deleteUser(req: Request, res: Response) {
        try {
            const result = await this.userService.deleteUser(parseInt(req.params.id));
            res.status(204).send();
        } catch (error) {
            if (error instanceof HttpException) {
                res.status(error.status).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    async updateUser(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const user = req.body;
            const result = await this.userService.updateUser(parseInt(id), user);
            if (!result) {
                throw new HttpException(404, 'Kullanıcı bulunamadı');
            }
            res.status(200).json(result);
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
