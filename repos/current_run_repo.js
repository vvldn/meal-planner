const fs = require('fs');

async function getCurrentRun() {
  try {
    const currentRun = fs.readFileSync('current_run.json', 'utf8');
    if (!currentRun) return { isDone: true };
    return JSON.parse(currentRun);
  } catch (err) {
    console.error('Error getting current run', err);
    return { isDone: true };
    // This is done to automatically trigger a new run if the file is not found
  }
}

async function updateCurrentRun(eventLog) {
  try {
    let currentRun = await getCurrentRun();
    if (!currentRun) {
      currentRun = {
        eventLog: [],
        isDone: false,
      };
    }
    currentRun.lastUpdated = new Date().toISOString();
    currentRun.eventLog.push(eventLog);
    fs.writeFileSync('current_run.json', JSON.stringify(currentRun, null, 2));
  } catch (err) {
    console.error('Error updating current run', err);
    fs.writeFileSync('current_run.json', JSON.stringify({
      lastUpdated: new Date().toISOString(),
      eventLog: [],
      isDone: false,
    }, null, 2));
  }
}

async function markCurrentRunAsDone() {
  try {
    const currentRun = await getCurrentRun();
    if (!currentRun) return;
    currentRun.isDone = true;
    fs.writeFileSync('current_run.json', JSON.stringify(currentRun, null, 2));
  } catch (err) {
    console.error('Error marking current run as done', err);
  }
}

async function markCurrentRunAsErrored(errorMessage) {
  try {
    const currentRun = await getCurrentRun();
    if (!currentRun) return;
    currentRun.isErrored = true;
    currentRun.errorMessage = errorMessage;
    fs.writeFileSync('current_run.json', JSON.stringify(currentRun, null, 2));
  } catch (err) {
    console.error('Error marking current run as errored', err);
  }
}

async function resetCurrentRun() {
  try {
    fs.writeFileSync('current_run.json', JSON.stringify({
      isDone: false,
      isErrored: false,
      errorMessage: null,
      eventLog: [],
    }, null, 2));
  } catch (err) {
    console.error('Error resetting current run', err);
  }
}

module.exports = {
  getCurrentRun,
  updateCurrentRun,
  markCurrentRunAsDone,
  markCurrentRunAsErrored,
  resetCurrentRun,
};
