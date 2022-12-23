const redis = require('redis');
const redis_address = process.env.REDIS_ADDRESS || "127.0.0.1";
const redis_port = process.env.REDIS_PORT || 6379;
const redis_password = process.env.REDIS_PASSWORD || "";

const client = redis.createClient({
    socket: {
        host: redis_address,
        port: redis_port,
    },
    password: redis_password
});

// Handler for "error" events
client.on('error', function(err) {
    console.error(err);
});

// Function that connects to the Redis instance
async function redisConnected() {
    console.log(`Connecting to Redis at ${redis_address}:${redis_port}`);

    await client.connect();

    console.log('Connected to Redis');
}

// Function to retrieve all the orders that exist in the Redis database.
// Returns a list of those orders.
async function getOrders() {
    var orders = [];
    var allKeys = await client.KEYS('order-*');

    for (key in allKeys) {
        var order = await client.hGetAll(allKeys[key]);
        order.number = allKeys[key];
        orders.push(order);
    }

    return orders
}

// Export the Redis client and getOrders function
module.exports = {
    client,
    getOrders,
    redisConnected,
}