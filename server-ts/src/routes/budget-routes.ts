import express from 'express';
import BudgetRepository from '../repository/budget-repository';
import BudgetService from '../service/budget-service';
import BudgetController from '../controller/budget-controller';
import { verifyToken } from '../middleware/verify-token';
import { validateValidation } from '../middleware/verify-validation';
import { createBudgetSchema, updateBudgetSchema } from '../schemas/budget-schema';

const budgetRepository = new BudgetRepository();
const budgetService = new BudgetService(budgetRepository);
const budgetController = new BudgetController(budgetService);

const router = express.Router();

router.get('/', verifyToken, budgetController.getAllBudgets.bind(budgetController));
router.get('/:id', verifyToken, budgetController.getBudgetById.bind(budgetController));
router.post(
    '/',
    validateValidation(createBudgetSchema),
    verifyToken,
    budgetController.createBudget.bind(budgetController),
);
router.delete('/:id', verifyToken, budgetController.deleteBudget.bind(budgetController));
router.put(
    '/:id',
    validateValidation(updateBudgetSchema),
    verifyToken,
    budgetController.updateBudget.bind(budgetController),
);

export default router;
