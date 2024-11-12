import HttpException from '../exceptions/http-exception';
import TaskRepository from '../repository/task-repository';

class TaskService {
    private taskRepository: TaskRepository;

    constructor(taskRepository: TaskRepository) {
        this.taskRepository = taskRepository;
    }

    async createTask(
        id: number,
        task: {
            title: string;
            description: string;
            status: string;
            priority: string;
            dueDate: string;
        },
    ) {
        let client;
        try {
            client = await this.taskRepository.beginTransaction();
            const newTask = await this.taskRepository.create(id, task);
            await this.taskRepository.commitTransaction(client);
            return newTask;
        } catch (error) {
            if (client) {
                await this.taskRepository.rollbackTransaction(client);
            }
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(500, (error as Error).message);
        }
    }

    async updateTask(
        id: number,
        task: {
            title: string;
            description: string;
            status: string;
            priority: string;
            dueDate: string;
        },
    ) {
        let client;
        try {
            const existingTask = await this.taskRepository.getTaskById(id);
            if (!existingTask) {
                throw new HttpException(404, `${id} numaralı görev bulunamadı`);
            }

            client = await this.taskRepository.beginTransaction();
            const updatedTask = await this.taskRepository.update(id, task);
            await this.taskRepository.commitTransaction(client);
            return updatedTask;
        } catch (error) {
            if (client) {
                await this.taskRepository.rollbackTransaction(client);
            }
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(500, (error as Error).message);
        }
    }

    async getAllTasks(id: number) {
        return this.taskRepository.getAllTasks(id);
    }

    async getTaskById(id: number) {
        return this.taskRepository.getTaskById(id);
    }

    async deleteTask(id: number) {
        return this.taskRepository.delete(id);
    }
}

export default TaskService;
