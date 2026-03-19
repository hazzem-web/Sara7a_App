import { createClient } from "redis"
import { REDIS_URI } from "../../config/index.js";
export const client = createClient({
  url: REDIS_URI
});

client.on("error", function(err) {
  throw err;
});

export const redisConnect = async()=>{
    try {
        await client.connect();
        console.log("Redis Connected");
    } catch (error) {
        console.error("can't connect to redis" , error)
    }
}