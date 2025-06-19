import { writable } from 'svelte/store';

function createTransactionStore() {
  const { subscribe, set, update } = writable([]);

  return {
    subscribe,
    loadTransactions: (data) => {
      set(data.map(t => ({ ...t })));
    },
    updateCategory: (transactionId, category) => {
      update(transactions => {
        const transaction = transactions.find(t => t.id === transactionId);
        if (transaction) {
          transaction.category = category;
        }
        return transactions;
      });
    }
  };
}

export const transactionStore = createTransactionStore();