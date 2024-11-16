import BudgetTransactionRepository from '../repository/budget-transaction-repository';

class BudgetTransactionService {
    private budgetTransactionRepository: BudgetTransactionRepository;

    constructor(budgetTransactionRepository: BudgetTransactionRepository) {
        this.budgetTransactionRepository = budgetTransactionRepository;
    }
}
