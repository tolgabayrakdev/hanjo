import BudgetTransactionRepository from '../repository/budget-transaction-repository';

type TransactionCreateDTO = {
    budget_id: number;
    amount: number;
    category: string;
    description?: string;
};

class BudgetTransactionService {
    private budgetTransactionRepository: BudgetTransactionRepository;

    constructor(budgetTransactionRepository: BudgetTransactionRepository) {
        this.budgetTransactionRepository = budgetTransactionRepository;
    }

    async addIncome(transactionData: TransactionCreateDTO) {
        let client;
        client = await this.budgetTransactionRepository.beginTransaction();
        try {
            const transaction = await this.budgetTransactionRepository.deposit(
                transactionData.budget_id,
                transactionData.amount,
                transactionData.category,
                transactionData.description,
            );

            const updatedBudget = await this.budgetTransactionRepository.updateBudgetAmount(
                transactionData.budget_id,
                transactionData.amount,
            );

            await this.budgetTransactionRepository.commitTransaction(client);
            return {
                transaction,
                currentBalance: updatedBudget.amount,
            };
        } catch (error: unknown) {
            await this.budgetTransactionRepository.rollbackTransaction(client);
            throw new Error(
                `Gelir eklenirken bir hata oluştu: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`,
            );
        }
    }

    async addExpense(transactionData: TransactionCreateDTO) {
        let client;
        client = await this.budgetTransactionRepository.beginTransaction();
        try {
            await this.budgetTransactionRepository.checkBudgetBalance(
                transactionData.amount
            );

            const transaction = await this.budgetTransactionRepository.withdraw(
                transactionData.budget_id,
                transactionData.amount,
                transactionData.category,
                transactionData.description,
            );

            const updatedBudget = await this.budgetTransactionRepository.updateBudgetAmount(
                -transactionData.amount,
                transactionData.budget_id,
            );

            await this.budgetTransactionRepository.commitTransaction(client);
            return {
                transaction,
                currentBalance: updatedBudget.amount,
            };
        } catch (error: unknown) {
            await this.budgetTransactionRepository.rollbackTransaction(client);
            throw new Error(
                `Gider eklenirken bir hata oluştu: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`,
            );
        }
    }

    async getTransactionById(transactionId: number) {
        try {
            const transaction =
                await this.budgetTransactionRepository.getTransactionById(transactionId);
            if (!transaction) {
                throw new Error('İşlem bulunamadı');
            }
            return transaction;
        } catch (error) {
            throw new Error('İşlem getirilirken bir hata oluştu');
        }
    }

    async getAllTransactions(budgetId: number) {
        try {
            const transactions =
                await this.budgetTransactionRepository.getAllTransactions(budgetId);
            return transactions;
        } catch (error) {
            throw new Error('İşlemler listelenirken bir hata oluştu');
        }
    }
}

export default BudgetTransactionService;
