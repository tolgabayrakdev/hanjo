import BudgetTransactionRepository from '../repository/budget-transaction-repository';

type TransactionCreateDTO = {
    amount: number;
    category: string;
    description?: string;
};

class BudgetTransactionService {
    private budgetTransactionRepository: BudgetTransactionRepository;

    constructor(budgetTransactionRepository: BudgetTransactionRepository) {
        this.budgetTransactionRepository = budgetTransactionRepository;
    }

    async addIncome(budgetId: number, transactionData: TransactionCreateDTO) {
        const client = await this.budgetTransactionRepository.beginTransaction();
        try {
            const transaction = await this.budgetTransactionRepository.deposit(
                client,
                budgetId,
                transactionData.amount,
                transactionData.category,
                transactionData.description
            );

            const updatedBudget = await this.budgetTransactionRepository.updateBudgetAmount(
                client,
                budgetId,
                transactionData.amount
            );

            await this.budgetTransactionRepository.commitTransaction(client);
            return {
                transaction,
                currentBalance: updatedBudget.amount
            };
        } catch (error: unknown) {
            await this.budgetTransactionRepository.rollbackTransaction(client);
            throw new Error(`Gelir eklenirken bir hata oluştu: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
        }
    }

    async addExpense(budgetId: number, transactionData: TransactionCreateDTO) {
        const client = await this.budgetTransactionRepository.beginTransaction();
        try {
            await this.budgetTransactionRepository.checkBudgetBalance(
                client,
                budgetId,
                transactionData.amount
            );

            const transaction = await this.budgetTransactionRepository.withdraw(
                client,
                budgetId,
                transactionData.amount,
                transactionData.category,
                transactionData.description
            );

            const updatedBudget = await this.budgetTransactionRepository.updateBudgetAmount(
                client,
                budgetId,
                -transactionData.amount
            );

            await this.budgetTransactionRepository.commitTransaction(client);
            return {
                transaction,
                currentBalance: updatedBudget.amount
            };
        } catch (error: unknown) {
            await this.budgetTransactionRepository.rollbackTransaction(client);
            throw new Error(`Gider eklenirken bir hata oluştu: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
        }
    }

    async getTransactionById(transactionId: number) {
        try {
            const transaction = await this.budgetTransactionRepository.getTransactionById(transactionId);
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
            const transactions = await this.budgetTransactionRepository.getAllTransactions(budgetId);
            return transactions;
        } catch (error) {
            throw new Error('İşlemler listelenirken bir hata oluştu');
        }
    }
}

export default BudgetTransactionService;
