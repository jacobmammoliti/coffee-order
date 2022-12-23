const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const routes = require('./routes/routes');
const redis = require('./helpers/redis');

console.log('Turning on espresso machine')

// Connect to Redis backend
redis.redisConnected();

// Register routes
app.use(routes);

// Setup listener
app.listen(port, function() {
    console.log(`Serving on port ${port}`);
})