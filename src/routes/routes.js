const express = require('express');
const pug = require('pug');
const path = require('path');
const bodyParser = require('body-parser');
const redisClient = require('../helpers/redis');
const app = module.exports = express();

// middleware
app.use(bodyParser.urlencoded({extended:true}));

// Set views path for Pug
app.set('views', path.join(__dirname, '../views'));

// Simple health endpoint
app.get('/healthz', function(req, res) {
    console.log(req.method, req.path, req.ip);

    res.sendStatus(200);
});

// Root endpoint
// Shows the order form and also shows previous orders
// stored in Redis.
app.get('/', async function(req, res) {
    console.log(req.method, req.path, req.ip);
    var timeout = setTimeout(() => {
        res.render('index.pug', {'cant_connect_to_redis': 'yes', 'orders': {},});
    }, 1000);
    
    var orders = await redisClient.getOrders()
    .then((data) => {
        clearTimeout(timeout);
        res.render('index.pug', {'cant_connect_to_redis': 'no', 'orders': data});
    }).catch((err) => {
        clearTimeout(timeout);
        res.json({
            message: 'Error connecting to Redis',
            error: err
        });
    });
});

// Order endpoint
// Receives POST requests, saves the data to Redis,
// and then redirects back to the index page
app.post('/order', function(req, res) {
    console.log(req.method, req.path, req.ip);

    redisClient.client.hSet('order-'.concat(String(Math.floor(Math.random()*90000) + 10000)), {
        'size': req.body.coffee_size,
        'type': req.body.coffee_type,
    });

    res.redirect('/');
});