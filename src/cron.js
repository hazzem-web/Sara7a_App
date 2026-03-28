import cron from 'node-cron';
import { deleteMany , userModel} from './database/index.js';
cron.schedule('* * * * *', async() => {
  let users = await deleteMany({
    model: userModel,
    filter: {isVerified: false},
  })

  if (users.deletedCount > 0) { 
    console.log(`Deleted ${users.deletedCount} Not Verified Users Found`)}
  }
);