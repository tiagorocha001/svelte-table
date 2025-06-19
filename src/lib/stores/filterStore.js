import { writable } from 'svelte/store';

function createFilterStore() {
  const initialState = {
    dateRange: { start: "", end: "" },
    selectedCategory: 'all',
    searchTerm: ''
  };

  console.log('Creating filter store with initial state:', initialState);

  const { subscribe, set, update } = writable(initialState);

  // Test the store immediately
  let currentValue;
  subscribe(value => {
    console.log('Filter store value changed to:', value);
    currentValue = value;
  })();

  console.log('Current store value after creation:', currentValue);

  return {
    subscribe,
    setDateRange: (dateRange) => {
      console.log('setDateRange called with:', dateRange);
      update(state => {
        console.log('State before dateRange update:', state);
        const newState = { ...state, dateRange };
        console.log('State after dateRange update:', newState);
        return newState;
      });
    },
    setSelectedCategory: (selectedCategory) => {
      console.log('setSelectedCategory called with:', selectedCategory);
      update(state => {
        console.log('State before category update:', state);
        const newState = { ...state, selectedCategory };
        console.log('State after category update:', newState);
        return newState;
      });
    },
    setSearchTerm: (searchTerm) => {
      console.log('setSearchTerm called with:', searchTerm);
      update(state => {
        console.log('State before search update:', state);
        const newState = { ...state, searchTerm };
        console.log('State after search update:', newState);
        return newState;
      });
    },
    reset: () => {
      console.log('Reset called, setting to:', initialState);
      set(initialState);
    }
  };
}

export const filterStore = createFilterStore();