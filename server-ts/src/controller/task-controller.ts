import HttpException from '../exceptions/http-exception';
import TaskService from '../service/task-service';
import { Request, Response } from 'express';

class TaskController {
    private taskService: TaskService;

    constructor(taskService: TaskService) {
        this.taskService = taskService;
    }

    async createTask(req: Request, res: Response) {
        try {
            const id = req.user.id;
            const user = await this.taskService.createTask(id, req.body);
            res.status(201).json(user);
        } catch (error) {
            if (error instanceof HttpException) {
                res.status(error.status).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    async getAllTasks(req: Request, res: Response) {
        try {
            const id = req.user.id;
            const result = await this.taskService.getAllTasks(id);
            res.status(200).json(result);
        } catch (error) {
            if (error instanceof HttpException) {
                res.status(error.status).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    async getTaskById(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const result = await this.taskService.getTaskById(parseInt(id));
            if (!result) {
                throw new HttpException(404, 'Task not found!');
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

    async deleteTask(req: Request, res: Response) {
        try {
            await this.taskService.deleteTask(parseInt(req.params.id));
            res.status(204).send();
        } catch (error) {
            if (error instanceof HttpException) {
                res.status(error.status).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    async updateTask(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const user = req.body;
            const result = await this.taskService.updateTask(parseInt(id), user);
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

export default TaskController;
