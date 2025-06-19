<script>
  import { filterStore } from './stores/filterStore.js';
  import { transactionStore } from './stores/transactionStore.js';
  import { categories } from './utils/categories.js';

  // Fix: Access the store correctly (it's just an array, not .transactions)
  const allCategories = $derived.by(() => {
    const usedCategories = new Set();
    $transactionStore.forEach(t => {
      if (t.category) usedCategories.add(t.category);
    });
    return Array.from(usedCategories).sort();
  });

  function clearFilters() {
    filterStore.reset();
  }

  // Event handlers that use the store's setter methods
  function handleStartDateChange(event) {
    const currentRange = $filterStore.dateRange;
    filterStore.setDateRange({ 
      start: event.target.value, 
      end: currentRange.end 
    });
  }

  function handleEndDateChange(event) {
    const currentRange = $filterStore.dateRange;
    filterStore.setDateRange({ 
      start: currentRange.start, 
      end: event.target.value 
    });
  }

  function handleCategoryChange(event) {
    filterStore.setSelectedCategory(event.target.value);
  }

  function handleSearchChange(event) {
    filterStore.setSearchTerm(event.target.value);
  }
</script>

<div class="bg-white p-6 rounded-lg shadow">
  <h2 class="text-lg font-medium text-gray-900 mb-4">Filters</h2>
  
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <!-- Date Range Start -->
    <div>
      <label for="start-date" class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
      <input 
        id="start-date"
        type="date" 
        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={$filterStore.dateRange.start}
        onchange={handleStartDateChange}
      />
    </div>
    
    <!-- Date Range End -->
    <div>
      <label for="end-date" class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
      <input 
        id="end-date"
        type="date" 
        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={$filterStore.dateRange.end}
        onchange={handleEndDateChange}
      />
    </div>
    
    <!-- Category Filter -->
    <div>
      <label for="category-select" class="block text-sm font-medium text-gray-700 mb-1">Category</label>
      <select 
        id="category-select"
        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={$filterStore.selectedCategory}
        onchange={handleCategoryChange}
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
      <label for="search-input" class="block text-sm font-medium text-gray-700 mb-1">Search Description</label>
      <input 
        id="search-input"
        type="text" 
        placeholder="Search transactions..."
        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={$filterStore.searchTerm}
        oninput={handleSearchChange}
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