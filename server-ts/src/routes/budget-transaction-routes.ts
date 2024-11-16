import express from 'express';
import BudgetTransactionRepository from '../repository/budget-transaction-repository';
import BudgetTransactionService from '../service/budget-transaction-service';
import BudgetTransactionController from '../controller/budget-transaction-controller';
import { verifyToken } from '../middleware/verify-token';
import { validateValidation } from '../middleware/verify-validation';
import {
    expenseTransactionSchema,
    incomeTransactionSchema,
} from '../schemas/budget-transaction-schema';

const budgetTransactionRepository = new BudgetTransactionRepository();
const budgetTransactionService = new BudgetTransactionService(budgetTransactionRepository);
const budgetTransactionController = new BudgetTransactionController(budgetTransactionService);

const router = express.Router();

router.post(
    '/income',
    validateValidation(incomeTransactionSchema),
    verifyToken,
    budgetTransactionController.addIncome.bind(budgetTransactionController),
);
router.post(
    '/expense',
    validateValidation(expenseTransactionSchema),
    verifyToken,
    budgetTransactionController.addExpense.bind(budgetTransactionController),
);
router.get(
    '/:id',
    verifyToken,
    budgetTransactionController.getTransactionById.bind(budgetTransactionController),
);
router.get(
    '/',
    verifyToken,
    budgetTransactionController.getAllTransactions.bind(budgetTransactionController),
);

export default router;
