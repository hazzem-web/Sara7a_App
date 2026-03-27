import cron from 'node-cron';
console.log("cron file")
cron.schedule('1 * * * *', () => {
  console.log('running a task every minute');
});