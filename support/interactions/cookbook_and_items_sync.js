const {writeResponseToSheet} = require('../google_workspace/google_sheet');

async function syncMealPlan(mealPlan) {
  const rows = [
    ['Week Number', 'Day of Week', 'Meal', 'Ingredients', 'Dishes']
  ];
  for (const meal of mealPlan) {
    rows.push([meal.weekNumber, meal.dayOfWeek, meal.meal.mealName, meal.meal.ingredients.join(', '), meal.meal.dishes.join(', ')]);
  }
  await writeResponseToSheet(rows, process.env.SHEET_ID, 'MealPlan');
}

async function syncMeals(meals) {
  const rows = [
    ['Meal Name', 'Ingredients', 'Dishes']
  ];
  for (const meal of meals) {
    rows.push([meal.mealName, meal.ingredients.join(', '), meal.dishes.join(', ')]);
  }
  await writeResponseToSheet(rows, process.env.SHEET_ID, 'Meals');
}

async function syncIngredients(ingredientsPerWeekList) {
  const rows = [
    ['Week Number', 'Ingredient Name', 'Quantity', 'Shelf Life', 'Needed For Dishes']
  ];
  for (const ingredientsPerWeek of ingredientsPerWeekList) { 
    for (const ingredient of ingredientsPerWeek.ingredients) {
      rows.push([ingredientsPerWeek.weekNumber, ingredient.name, `${ingredient.quantity} ${ingredient.unit}`, ingredient.shelfLife, ingredient.neededForDishes.join(', ')]);
    }
  }
  await writeResponseToSheet(rows, process.env.SHEET_ID, 'Ingredients');
}

module.exports = {
  syncMealPlan,
  syncMeals,
  syncIngredients,
}
