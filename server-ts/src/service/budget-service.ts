import HttpException from '../exceptions/http-exception';
import BudgetRepository from '../repository/budget-repository';

class BudgetService {
    private budgetRepository: BudgetRepository;

    constructor(budgetRepository: BudgetRepository) {
        this.budgetRepository = budgetRepository;
    }

    async createBudget(
        id: number,
        budget: {
            name: string;
            description: string;
            amount: number;
        },
    ) {
        let client;
        try {
            client = await this.budgetRepository.beginTransaction();
            const newBudget = await this.budgetRepository.create(id, budget);
            await this.budgetRepository.commitTransaction(client);
            return newBudget;
        } catch (error) {
            if (client) {
                await this.budgetRepository.rollbackTransaction(client);
            }
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(500, (error as Error).message);
        }
    }

    async updateBudget(
        id: number,
        budget: {
            name: string;
            descreption: string;
            amount: number;
        },
    ) {
        let client;
        try {
            client = await this.budgetRepository.beginTransaction();
            const updatedContact = await this.budgetRepository.update(id, budget);
            await this.budgetRepository.commitTransaction(client);
            return updatedContact;
        } catch (error) {
            if (client) {
                await this.budgetRepository.rollbackTransaction(client);
            }
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(500, (error as Error).message);
        }
    }

    async getAllBudgets(id: number) {
        return this.budgetRepository.getAllBudgets(id);
    }

    async getBudgetById(id: number) {
        return this.budgetRepository.getBudgetById(id);
    }

    async deleteBudget(id: number) {
        return this.budgetRepository.delete(id);
    }
}

export default BudgetService;
