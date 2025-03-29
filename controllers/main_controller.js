const currentRunRepo = require('../repos/current_run_repo');
const runService = require('../services/run');
const runHelper = require('../helpers/run');


async function checkAndRefreshMealPlanIfApplicable(req, res) {
  try {
    console.log('Checking and refreshing meal plan if applicable');
    const currentRun = await currentRunRepo.getCurrentRun();
    const { isDone, isErrored } = currentRun;
    if (!isDone && !isErrored) {
      console.log('Current run is not done, skipping');
      const formattedCurrentRun = await runService.getFormattedCurrentRun();
      return res.status(200).json(formattedCurrentRun);
    }
    const { lastUpdated } = currentRun;
    const hasItBeenMoreThanFiveMinutes = new Date(lastUpdated).getTime() + 5 * 60 * 1000 < Date.now();
    if (hasItBeenMoreThanFiveMinutes) {
      console.log('Refreshing meal plan');
      runHelper.refreshMealPlan();
    }
    console.log('Current run is fairly new, not refreshing');
    const formattedCurrentRun = await runService.getFormattedCurrentRun();
    return res.status(200).json(formattedCurrentRun);
  } catch (err) {
    console.error('Error checking and refreshing meal plan if applicable', err);
    return res.status(500).json({ error: 'Error checking and refreshing meal plan if applicable' });
  }
}

module.exports = {
  checkAndRefreshMealPlanIfApplicable,
};
