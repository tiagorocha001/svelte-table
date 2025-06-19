<script>
  let { transactions } = $props();

  const categoryData = $derived.by(() => {
    const data = {};
    
    transactions.forEach(transaction => {
      const category = transaction.category || 'Uncategorized';
      if (!data[category]) {
        data[category] = { total: 0, count: 0, transactions: [] };
      }
      data[category].total += Math.abs(transaction.amount);
      data[category].count += 1;
      data[category].transactions.push(transaction);
    });
    
    return Object.entries(data)
      .map(([category, info]) => ({
        category,
        total: info.total,
        count: info.count,
        average: info.total / info.count,
        transactions: info.transactions
      }))
      .sort((a, b) => b.total - a.total);
  });

  const totalSpent = $derived(
    categoryData.reduce((sum, cat) => sum + cat.total, 0)
  );

  function getPercentage(amount) {
    return totalSpent > 0 ? ((amount / totalSpent) * 100).toFixed(1) : 0;
  }

  function getBarWidth(amount) {
    return totalSpent > 0 ? (amount / totalSpent) * 100 : 0;
  }
</script>

<div class="space-y-6">
  <!-- Category Breakdown -->
  <div class="bg-white p-6 rounded-lg shadow">
    <h2 class="text-xl font-bold text-gray-900 mb-6">Spending by Category</h2>
    
    <div class="space-y-4">
      {#each categoryData as category}
        <div class="border-b border-gray-200 pb-4 last:border-b-0">
          <div class="flex justify-between items-center mb-2">
            <h3 class="font-medium text-gray-900">{category.category}</h3>
            <div class="text-right">
              <p class="font-semibold text-gray-900">${category.total.toFixed(2)}</p>
              <p class="text-sm text-gray-500">{getPercentage(category.total)}%</p>
            </div>
          </div>
          
          <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div 
              class="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style="width: {getBarWidth(category.total)}%"
            ></div>
          </div>
          
          <div class="flex justify-between text-sm text-gray-600">
            <span>{category.count} transactions</span>
            <span>Avg: ${category.average.toFixed(2)}</span>
          </div>
        </div>
      {/each}
    </div>
  </div>

    <!-- Summary Statistics -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <div class="bg-white p-4 rounded-lg shadow">
      <h3 class="text-sm font-medium text-gray-500">Categories</h3>
      <p class="text-2xl font-bold text-gray-900">{categoryData.length}</p>
    </div>
    <div class="bg-white p-4 rounded-lg shadow">
      <h3 class="text-sm font-medium text-gray-500">Total Spent</h3>
      <p class="text-2xl font-bold text-red-600">${totalSpent.toFixed(2)}</p>
    </div>
    <div class="bg-white p-4 rounded-lg shadow">
      <h3 class="text-sm font-medium text-gray-500">Largest Category</h3>
      <p class="text-lg font-bold text-gray-900">
        {categoryData.length > 0 ? categoryData[0].category : 'N/A'}
      </p>
    </div>
    <div class="bg-white p-4 rounded-lg shadow">
      <h3 class="text-sm font-medium text-gray-500">Avg per Category</h3>
      <p class="text-2xl font-bold text-gray-900">
        ${categoryData.length > 0 ? (totalSpent / categoryData.length).toFixed(2) : '0.00'}
      </p>
    </div>
  </div>
</div>