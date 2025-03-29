const dotenv = require('dotenv');
dotenv.config();

const generateMealService = require('./services/generate_items');
const openAiSupport = require('./support/openai');
const {syncMealPlan, syncMeals, syncIngredients} = require('./support/interactions/cookbook_and_items_sync');
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
  const { mealPlan, meals, ingredients } = response;
  await syncMealPlan(mealPlan);
  await syncMeals(meals);
  await syncIngredients(ingredients);
  console.log('meal plan synced to sheet');
}

main();