<script>
  import { filterStore } from './stores/filterStore.js';
  import { transactionStore } from './stores/transactionStore.js';
  import { categories } from './utils/categories.js';

  const allCategories = $derived(() => {
    const usedCategories = new Set();
    transactionStore.transactions.forEach(t => {
      if (t.category) usedCategories.add(t.category);
    });
    return Array.from(usedCategories).sort();
  });

  function clearFilters() {
    filterStore.reset();
  }
  console.log("filterStore", filterStore)
</script>

<div class="bg-white p-6 rounded-lg shadow">
  <h2 class="text-lg font-medium text-gray-900 mb-4">Filters</h2>
  
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <!-- Date Range -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
      <input 
        type="date" 
        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
    
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
      <input 
        type="date" 
        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
    
    <!-- Category Filter -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
      <select 
        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        bind:value={filterStore.selectedCategory}
      >
        <option value="all">All Categories</option>
        <option value="uncategorized">Uncategorized</option>
        {#each allCategories as category}
          <option value={category}>{category}</option>
        {/each}
      </select>
    </div>
    
    <!-- Search -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Search Description</label>
      <input 
        type="text" 
        placeholder="Search transactions..."
        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        bind:value={filterStore.searchTerm}
      />
    </div>
  </div>
  
  <div class="mt-4">
    <button 
      class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
      onclick={clearFilters}
    >
      Clear Filters
    </button>
  </div>
</div>