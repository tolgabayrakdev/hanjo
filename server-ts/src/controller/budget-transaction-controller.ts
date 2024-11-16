import { Request, Response } from 'express';
import { BudgetTransactionService } from '../service/budget-transaction-service';

export class BudgetTransactionController {
    constructor(private transactionService: BudgetTransactionService) {}

    async createTransaction(req: Request, res: Response) {
        try {
            const transaction = await this.transactionService.createTransaction(req.body);
            res.status(201).json(transaction);
        } catch (error) {
            res.status(500).json({
                error: 'İşlem oluşturulurken bir hata oluştu',
            });
        }
    }

    async getTransactionsByBudget(req: Request, res: Response) {
        try {
            const budgetId = parseInt(req.params.budgetId);
            const transactions = await this.transactionService.getTransactionsByBudget(budgetId);
            res.json(transactions);
        } catch (error) {
            res.status(500).json({
                error: 'İşlemler getirilirken bir hata oluştu',
            });
        }
    }

    async updateTransaction(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const transaction = await this.transactionService.updateTransaction(id, req.body);
            res.json(transaction);
        } catch (error) {
            res.status(500).json({
                error: 'İşlem güncellenirken bir hata oluştu',
            });
        }
    }

    async deleteTransaction(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const transaction = await this.transactionService.deleteTransaction(id);
            res.json(transaction);
        } catch (error) {
            res.status(500).json({ error: 'İşlem silinirken bir hata oluştu' });
        }
    }
}
