import api from "../api/axiosConfig";
import { Transaction } from "../types";

const TRANSACTION_BASE_URL = "/transactions";

class TransactionService {
  getAllTransactions() {
    return api.get<Array<Transaction>>(TRANSACTION_BASE_URL);
  }

  getTransactionById(transactionId: string) {
    return api.get<Transaction>(`${TRANSACTION_BASE_URL}/${transactionId}`);
  }

  createTransaction(transaction: Transaction) {
    return api.post<Transaction>(TRANSACTION_BASE_URL, transaction);
  }
}

export default new TransactionService();
