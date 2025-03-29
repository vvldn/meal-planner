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
  console.log('Starting to prompt');
  const response = await openAiSupport.getPromptResponse(prompt, generateMealService.responseFormat);
  console.log('Prompt done');
  fs.writeFileSync('response.json', JSON.stringify(response, null, 2));
  console.log('Response written to response.json');
  const { mealPlan, meals, ingredients } = response;
  console.log('Syncing meal plan');
  await syncMealPlan(mealPlan);
  console.log('Meal plan synced to sheet');
  console.log('Syncing meals');
  await syncMeals(meals);
  console.log('Meals synced to sheet');
  console.log('Syncing ingredients');
  await syncIngredients(ingredients);
  console.log('Ingredients synced to sheet');
}

main();