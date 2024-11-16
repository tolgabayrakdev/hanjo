import { Request, Response } from 'express';
import HttpException from '../exceptions/http-exception';
import BudgetService from '../service/budget-service';

class BudgetController {
    private budgetService: BudgetService;

    constructor(BudgetService: BudgetService) {
        this.budgetService = BudgetService;
    }

    async createBudget(req: Request, res: Response) {
        try {
            const id = req.user.id;
            const budget = await this.budgetService.createBudget(id, req.body);
            res.status(201).json(budget);
        } catch (error) {
            if (error instanceof HttpException) {
                res.status(error.status).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    async getAllBudgets(req: Request, res: Response) {
        try {
            const id = req.user.id;
            const result = await this.budgetService.getAllBudgets(id);
            res.status(200).json(result);
        } catch (error) {
            if (error instanceof HttpException) {
                res.status(error.status).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    async getBudgetById(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const result = await this.budgetService.getBudgetById(parseInt(id));
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

    async deleteBudget(req: Request, res: Response) {
        try {
            await this.budgetService.deleteBudget(parseInt(req.params.id));
            res.status(204).send();
        } catch (error) {
            if (error instanceof HttpException) {
                res.status(error.status).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    async updateBudget(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const data = req.body;
            const result = await this.budgetService.updateBudget(parseInt(id), data);
            if (!result) {
                throw new HttpException(404, 'Budget not found!');
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
