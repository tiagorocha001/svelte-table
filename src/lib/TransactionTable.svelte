<script>
  import { transactionStore } from './stores/transactionStore.js';
  import { categories } from './utils/categories.js';

  let { transactions } = $props();
  let sortField = $state('date');
  let sortDirection = $state('desc');

  const sortedTransactions = $derived.by(() => {
    const sorted = [...transactions].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      
      if (sortField === 'date') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      } else if (sortField === 'amount') {
        aVal = parseFloat(aVal);
        bVal = parseFloat(bVal);
      }
      
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    return transactions;
  });

  function handleSort(field) {
    if (sortField === field) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortField = field;
      sortDirection = 'desc';
    }
  }

  function handleCategoryChange(transactionId, category) {
    transactionStore.updateCategory(transactionId, category);
  }

  function getSortIcon(field) {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  }

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString();
  }

  function formatAmount(amount) {
    const abs = Math.abs(amount);
    return amount >= 0 ? `+$${abs.toFixed(2)}` : `-$${abs.toFixed(2)}`;
  }
</script>

<div class="bg-white shadow overflow-hidden rounded-lg">
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th 
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            onclick={() => handleSort('date')}
          >
            Date {getSortIcon('date')}
          </th>
          <th 
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            onclick={() => handleSort('description')}
          >
            Description {getSortIcon('description')}
          </th>
          <th 
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            onclick={() => handleSort('amount')}
          >
            Amount {getSortIcon('amount')}
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Category
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        {#each sortedTransactions as transaction (transaction.id)}
          <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {formatDate(transaction.date)}
            </td>
            <td class="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
              {transaction.description}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium {transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}">
              {formatAmount(transaction.amount)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <select 
                class="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={transaction.category || ''}
                onchange={(e) => handleCategoryChange(transaction.id, e.target.value || null)}
              >
                <option value="">Uncategorized</option>
                {#each categories as category}
                  <option value={category}>{category}</option>
                {/each}
              </select>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
    
    {#if sortedTransactions.length === 0}
      <div class="text-center py-12">
        <p class="text-gray-500">No transactions found matching your filters.</p>
      </div>
    {/if}
  </div>
</div>