import express from 'express';
import TaskRepository from '../repository/task-repository';
import TaskService from '../service/task-service';
import TaskController from '../controller/task-controller';
import { verifyToken } from '../middleware/verify-token';
import { validateValidation } from '../middleware/verify-validation';
import { createTaskSchema, updateTaskSchema } from '../schemas/task-schema';

const taskRepository = new TaskRepository();
const taskService = new TaskService(taskRepository);
const taskController = new TaskController(taskService);

const router = express.Router();

router.get('/', verifyToken, taskController.getAllTasks.bind(taskController));
router.get('/:id', verifyToken, taskController.getTaskById.bind(taskController));
router.post(
    '/',
    validateValidation(createTaskSchema),
    verifyToken,
    taskController.createTask.bind(taskController),
);
router.delete('/:id', verifyToken, taskController.deleteTask.bind(taskController));
router.put(
    '/:id',
    validateValidation(updateTaskSchema),
    verifyToken,
    taskController.updateTask.bind(taskController),
);

export default router;
