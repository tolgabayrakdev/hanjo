import express from 'express';
import BudgetTransactionRepository from '../repository/budget-transaction-repository';
import BudgetTransactionService from '../service/budget-transaction-service';
import BudgetTransactionController from '../controller/budget-transaction-controller';

const budgetTransactionRepository = new BudgetTransactionRepository();
const budgetTransactionService = new BudgetTransactionService(budgetTransactionRepository);
const budgetTransactionController = new BudgetTransactionController(budgetTransactionService);

const router = express.Router();

router.post('/income', budgetTransactionController.addIncome.bind(budgetTransactionController));
router.post('/expense', budgetTransactionController.addExpense.bind(budgetTransactionController));
router.get('/:id', budgetTransactionController.getTransactionById.bind(budgetTransactionController));
router.get('/', budgetTransactionController.getAllTransactions.bind(budgetTransactionController));


export default router;
