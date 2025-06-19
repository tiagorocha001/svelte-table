<script>
  import { transactionStore } from './stores/transactionStore.js';
  import { categorizationRules } from './utils/categorization.js';
  import { categories } from './utils/categories.js';

  let { onClose } = $props();
  
  let suggestions = $state([]);
  let selectedSuggestions = $state(new Set());

  $effect(() => {
    // Generate suggestions for uncategorized transactions
    const uncategorized = transactionStore.transactions.filter(t => !t.category);
    const newSuggestions = [];
    
    uncategorized.forEach(transaction => {
      const suggestedCategory = categorizationRules.categorizeTransaction(transaction);
      if (suggestedCategory) {
        newSuggestions.push({
          transactionId: transaction.id,
          transaction,
          suggestedCategory,
          confidence: categorizationRules.getConfidence(transaction, suggestedCategory)
        });
      }
    });
    
    suggestions = newSuggestions.sort((a, b) => b.confidence - a.confidence);
  });

  function toggleSuggestion(suggestionId) {
    if (selectedSuggestions.has(suggestionId)) {
      selectedSuggestions.delete(suggestionId);
    } else {
      selectedSuggestions.add(suggestionId);
    }
  }

  function selectAll() {
    selectedSuggestions = new Set(suggestions.map(s => s.transactionId));
  }

  function deselectAll() {
    selectedSuggestions = new Set();
  }

  function applySuggestions() {
    suggestions.forEach(suggestion => {
      if (selectedSuggestions.has(suggestion.transactionId)) {
        transactionStore.updateCategory(suggestion.transactionId, suggestion.suggestedCategory);
      }
    });
    onClose();
  }
</script>

<div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
  <div class="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
    <div class="mt-3">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-medium text-gray-900">Bulk Categorization</h3>
        <button 
          class="text-gray-400 hover:text-gray-600"
          onclick={onClose}
        >
          ✕
        </button>
      </div>
      
      <p class="text-sm text-gray-600 mb-4">
        Review and apply suggested categories for your uncategorized transactions.
      </p>
      
      {#if suggestions.length === 0}
        <div class="text-center py-8">
          <p class="text-gray-500">No categorization suggestions available. All transactions may already be categorized.</p>
        </div>
      {:else}
        <div class="mb-4 flex space-x-2">
          <button 
            class="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
            onclick={selectAll}
          >
            Select All
          </button>
          <button 
            class="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
            onclick={deselectAll}
          >
            Deselect All
          </button>
        </div>
        
        <div class="max-h-96 overflow-y-auto border rounded">
          <table class="min-w-full">
            <thead class="bg-gray-50 sticky top-0">
              <tr>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Select</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Transaction</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Suggested Category</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Confidence</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              {#each suggestions as suggestion}
                <tr class="hover:bg-gray-50">
                  <td class="px-4 py-2">
                    <input 
                      type="checkbox" 
                      checked={selectedSuggestions.has(suggestion.transactionId)}
                      onchange={() => toggleSuggestion(suggestion.transactionId)}
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td class="px-4 py-2">
                    <div class="text-sm font-medium text-gray-900">{suggestion.transaction.description}</div>
                    <div class="text-sm text-gray-500">${Math.abs(suggestion.transaction.amount).toFixed(2)}</div>
                  </td>
                  <td class="px-4 py-2">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {suggestion.suggestedCategory}
                    </span>
                  </td>
                  <td class="px-4 py-2">
                    <div class="flex items-center">
                      <div class="w-full bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          class="bg-green-600 h-2 rounded-full"
                          style="width: {suggestion.confidence}%"
                        ></div>
                      </div>
                      <span class="text-sm text-gray-600">{suggestion.confidence}%</span>
                    </div>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
      
      <div class="flex justify-end space-x-3 mt-6">
        <button 
          class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
          onclick={onClose}
        >
          Cancel
        </button>
        {#if suggestions.length > 0}
          <button 
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            onclick={applySuggestions}
            disabled={selectedSuggestions.size === 0}
          >
            Apply {selectedSuggestions.size} Categories
          </button>
        {/if}
      </div>
    </div>
  </div>
</div>