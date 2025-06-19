export const categorizationRules = {
  rules: [
    { keywords: ['starbucks', 'coffee bean', 'dunkin'], category: 'Coffee', confidence: 95 },
    { keywords: ['whole foods', 'safeway', 'kroger', 'trader joes', 'costco'], category: 'Groceries', confidence: 90 },
    { keywords: ['shell', 'chevron', 'texaco', 'gas'], category: 'Gas', confidence: 90 },
    { keywords: ['amazon', 'target', 'best buy', 'macys'], category: 'Shopping', confidence: 85 },
    { keywords: ['netflix', 'spotify', 'adobe', 'zoom', 'github'], category: 'Subscriptions', confidence: 95 },
    { keywords: ['uber', 'lyft'], category: 'Transportation', confidence: 90 },
    { keywords: ['mcdonalds', 'taco bell', 'dominos', 'chipotle', 'panda express', 'in-n-out'], category: 'Fast Food', confidence: 90 },
    { keywords: ['doordash', 'uber eats'], category: 'Restaurants', confidence: 85 },
    { keywords: ['cvs', 'walgreens', 'pharmacy'], category: 'Healthcare', confidence: 85 },
    { keywords: ['home depot', 'lowes'], category: 'Home Improvement', confidence: 90 },
    { keywords: ['electric bill', 'verizon'], category: 'Utilities', confidence: 95 },
    { keywords: ['salary', 'paypal transfer', 'deposit', 'refund'], category: 'Income', confidence: 90 },
    { keywords: ['rent payment'], category: 'Rent', confidence: 95 },
    { keywords: ['steam'], category: 'Entertainment', confidence: 90 }
  ],

  categorizeTransaction(transaction) {
    const description = transaction.description.toLowerCase();
    
    for (const rule of this.rules) {
      if (rule.keywords.some(keyword => description.includes(keyword))) {
        return rule.category;
      }
    }
    
    return null;
  },

  getConfidence(transaction, category) {
    const description = transaction.description.toLowerCase();
    const rule = this.rules.find(r => r.category === category);
    
    if (rule) {
      const matchingKeywords = rule.keywords.filter(keyword => description.includes(keyword));
      if (matchingKeywords.length > 0) {
        return rule.confidence;
      }
    }
    
    return 50; // Default confidence
  }
};
