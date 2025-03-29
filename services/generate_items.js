const zod = require("zod");

const { zodResponseFormat } = require("openai/helpers/zod");

const mealSchema = zod.object({
  mealName: zod.string(),
  ingredients: zod.array(zod.string()),
  dishes: zod.array(zod.string())
});

const ingredientSchema = zod.object({
  name: zod.string(),
  shelfLife: zod.number(),
  quantity: zod.number(),
  unit: zod.string(),
  neededForDishes: zod.array(zod.string()),
});

const ingredientListSchema = zod.array(zod.object({
  ingredients: zod.array(ingredientSchema),
  weekNumber: zod.number(),
}));

const mealsSchema = zod.array(mealSchema);

const mealPlanSchema = zod.array(zod.object({
  meal: mealSchema,
  dayOfWeek: zod.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]),
  weekNumber: zod.number(),
}));

const responseObject = zodResponseFormat(
  zod.object({
    mealPlan: mealPlanSchema,
    meals: mealsSchema,
    ingredients: ingredientListSchema
  }),
  "mealPlanner"
);

function generateMealsPrompt(excludeItems) {
  const prompt = `
  Generate a south indian meal plan for 2 weeks (for 5 week days only for each week).
  Only Lunch is needed, the same meal is re-used for dinner.

  If suggesting chicken or paneer dishes, ensure that they're suggested for two consecutive days to avoid wastage.

  Suggest some fruits.

  No deep fried items allowed. Need healthy options.

  Consider the fact that each meal can have multiple dishes.

  Something like aloo paratha may not need any additional dish, but something like rice needs a curry and a poriyal.

  First brainstorm and come up with AT LEAST 20 meal options.
  strictly exclude any meal that requires the following items : ${excludeItems.join(", ")}
  for main course, stick to rice items or roti / aloo paratha. Do not suggest chole, naan, kulcha, bread / paav based items etc.
  DO NOT SUGGEST BIRIYANI.

  Then select 5 meals per week, for two weeks - pick meals you think are tasty and popular, ensuring balanced meals with variety, and re-usability of chicken / paneer.

  In response, provide all the meals you've thought of, the meal plan for each week for two weeks, and the ingredients to be purchased each week.

  Things to ensure:
  All the ingredients are to be listed in the ingredients array, and ensure that all ingredients for a specific week are listed in the ingredients array.
  Ingredients like oil, salt, chilli, mustard seed, turmeric powder etc can be omitted.
  `;
  return prompt;
}

module.exports = {
  prompt: generateMealsPrompt,
  responseFormat: responseObject,
}
