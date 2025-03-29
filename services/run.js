const currentRunRepo = require('../repos/current_run_repo');

async function getFormattedCurrentRun() {
  const currentRun = await currentRunRepo.getCurrentRun();
  return currentRun;
}

module.exports = {
  getFormattedCurrentRun,
};
