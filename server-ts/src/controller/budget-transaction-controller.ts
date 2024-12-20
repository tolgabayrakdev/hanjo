import { Request, Response } from 'express';
import HttpException from '../exceptions/http-exception';
import BudgetTransactionService from '../service/budget-transaction-service';

class BudgetController {
    private budgetTransactionService: BudgetTransactionService;

    constructor(budgetTransactionService: BudgetTransactionService) {
        this.budgetTransactionService = budgetTransactionService;
    }

    async addExpense(req: Request, res: Response) {
        try {
            const budget = await this.budgetTransactionService.addExpense(req.body);
            res.status(201).json(budget);
        } catch (error) {                                    
            if (error instanceof HttpException) {
                res.status(error.status).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    async addIncome(req: Request, res: Response) {        
        try {
            const budget = await this.budgetTransactionService.addIncome(req.body);
            res.status(201).json(budget);
        } catch (error) {
            if (error instanceof HttpException) {
                res.status(error.status).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    async getAllTransactions(req: Request, res: Response) {
        try {
            const budgetId = req.body.budget_id;

            const result = await this.budgetTransactionService.getAllTransactions(+budgetId);
            res.status(200).json(result);
        } catch (error) {
            if (error instanceof HttpException) {
                res.status(error.status).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    async getTransactionById(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const result = await this.budgetTransactionService.getTransactionById(parseInt(id));
            if (!result) {
                throw new HttpException(404, 'Contact not found!');
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

export default BudgetController;
