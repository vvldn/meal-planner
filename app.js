const generateMealService = require('./services/generate_items');
const openAiSupport = require('./support/openai');

const fs = require('fs');

async function main() {
  const itemsToExclude = [
    'Chinese Dishes',
    'Fish',
    'Deep Fried Items',
    'Capcicum',
    'Lemon Rice',
    'Anything involving coconut',
    'drumstick',
    'rajma',
    'corn',
    'mushroom'
  ];
  const prompt = generateMealService.prompt(itemsToExclude);
  const response = await openAiSupport.getPromptResponse(prompt, generateMealService.responseFormat);
  fs.writeFileSync('response.json', JSON.stringify(response, null, 2));
  console.log('response written to response.json');
}

main();