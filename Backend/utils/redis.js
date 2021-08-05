const redis = require("redis")

const redis_client = redis.createClient();

redis_client.on("connect", () => {
    console.log("Redis connected . . .")
})

module.exports = redis_client;