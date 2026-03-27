import cron from 'node-cron';
import { deleteMany , userModel} from './database/index.js';
console.log("cron file")
cron.schedule('* * * * *', async() => {
  let users = await deleteMany({
    model: userModel,
    filter: {isVerified: false},
  })

  console.log(`Deleted ${users.deletedCount} Not Verified Users Found`)
});