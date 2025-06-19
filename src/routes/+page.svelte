<script>
  import { onMount } from 'svelte';
  import TransactionTable from '../lib/TransactionTable.svelte';
  import CategoryAnalytics from '../lib/CategoryAnalytics.svelte';
  import FilterControls from '../lib/FilterControls.svelte';
  import BulkCategorization from '../lib/BulkCategorization.svelte';
  import { transactionStore } from '../lib/stores/transactionStore.js';
  import { filterStore } from '../lib/stores/filterStore.js';
  import { mockTransactions } from '../lib/data/mockData';

  let activeTab = $state('transactions');
  let showBulkModal = $state(false);

  onMount(() => {
    // Load mock data
    transactionStore.loadTransactions(mockTransactions);
  });

const filteredTransactions = $derived(
$transactionStore?.filter(transaction => {
    const date = new Date(transaction.date);
    const startDate = $filterStore?.dateRange?.start ? new Date($filterStore?.dateRange?.start) : null;
    const endDate = $filterStore?.dateRange?.end ? new Date($filterStore?.dateRange?.end) : null;
    
    if (startDate && date < startDate) return false;
    if (endDate && date > endDate) return false;
    
    if ($filterStore.selectedCategory && $filterStore.selectedCategory !== 'all') {
    if ($filterStore.selectedCategory === 'uncategorized') {
        return !transaction.category;
    }
    return transaction.category === $filterStore.selectedCategory;
    }
    
    if ($filterStore.searchTerm) {
    return transaction.description.toLowerCase().includes($filterStore.searchTerm.toLowerCase());
    }
    
    return true;
}) || []
);

  const totalAmount = $derived(
    filteredTransactions?.reduce((sum, t) => sum + t.amount, 0) || []
  );

  const transactionCount = $derived(filteredTransactions?.length);
</script>

<div class="min-h-screen bg-gray-50">
  <header class="bg-white shadow-sm border-b">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-6">
        <h1 class="text-3xl font-bold text-gray-900">Transaction Manager</h1>
        <div class="flex space-x-4">
          <button
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onclick={() => showBulkModal = true}
          >
            Bulk Categorize
          </button>
        </div>
      </div>
    </div>
  </header>

  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Summary Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-sm font-medium text-gray-500">Total Transactions</h3>
        <p class="text-2xl font-bold text-gray-900">{transactionCount}</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-sm font-medium text-gray-500">Total Amount</h3>
        <p class="text-2xl font-bold {totalAmount >= 0 ? 'text-green-600' : 'text-red-600'}">
          ${Math.abs(totalAmount).toFixed(2)} {totalAmount >= 0 ? '' : '(spent)'}
        </p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-sm font-medium text-gray-500">Average Transaction</h3>
        <p class="text-2xl font-bold text-gray-900">
          ${transactionCount > 0 ? Math.abs(totalAmount / transactionCount).toFixed(2) : '0.00'}
        </p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="mb-6">
      <nav class="flex space-x-8">
        <button
          class="pb-2 border-b-2 font-medium text-sm transition-colors {activeTab === 'transactions' 
            ? 'border-blue-500 text-blue-600' 
            : 'border-transparent text-gray-500 hover:text-gray-700'}"
          onclick={() => activeTab = 'transactions'}
        >
          Transactions
        </button>
        <button
          class="pb-2 border-b-2 font-medium text-sm transition-colors {activeTab === 'analytics' 
            ? 'border-blue-500 text-blue-600' 
            : 'border-transparent text-gray-500 hover:text-gray-700'}"
          onclick={() => activeTab = 'analytics'}
        >
          Analytics
        </button>
      </nav>
    </div>

    {#if activeTab === 'transactions'}
      <div class="space-y-6">
        <FilterControls />
        <TransactionTable transactions={filteredTransactions} />
      </div>
    {:else if activeTab === 'analytics'}
      <CategoryAnalytics transactions={filteredTransactions} />
    {/if}

    <!-- Bulk Categorization Modal -->
    {#if showBulkModal}
      <BulkCategorization 
        onClose={() => showBulkModal = false}
      />
    {/if}
  </main>
</div>

<style>
  :global(body) {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  }
</style>