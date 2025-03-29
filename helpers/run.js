const dotenv = require('dotenv');
dotenv.config();

const generateMealService = require('../services/generate_items');
const openAiSupport = require('../support/openai');
const { syncMealPlan, syncMeals, syncIngredients } = require('../support/interactions/cookbook_and_items_sync');

const currentRunRepo = require('../repos/current_run_repo');
const fs = require('fs');

async function refreshMealPlan() {
  try {
    await currentRunRepo.resetCurrentRun();
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
    await currentRunRepo.updateCurrentRun({
      timestamp: new Date().toISOString(),
      message: 'Refreshing meal plan',
    });
    const response = await openAiSupport.getPromptResponse(prompt, generateMealService.responseFormat);
    await currentRunRepo.updateCurrentRun({
      timestamp: new Date().toISOString(),
      message: 'Prompt Generation Done',
    });
    fs.writeFileSync('response.json', JSON.stringify(response, null, 2));
    const { mealPlan, meals, ingredients } = response;
    await currentRunRepo.updateCurrentRun({
      timestamp: new Date().toISOString(),
      message: 'Syncing meal plan',
    });
    await syncMealPlan(mealPlan);
    await currentRunRepo.updateCurrentRun({
      timestamp: new Date().toISOString(),
      message: 'Meal plan synced to sheet',
    });
    await syncMeals(meals);
    await currentRunRepo.updateCurrentRun({
      timestamp: new Date().toISOString(),
      message: 'Meals synced to sheet',
    });
    await syncIngredients(ingredients);
    await currentRunRepo.updateCurrentRun({
      timestamp: new Date().toISOString(),
      message: 'Ingredients synced to sheet',
    });
    await currentRunRepo.markCurrentRunAsDone();
  } catch (err) {
    console.error('Error refreshing meal plan', err);
    await currentRunRepo.markCurrentRunAsErrored(err.message);
  }
}

module.exports = {
  refreshMealPlan,
};
