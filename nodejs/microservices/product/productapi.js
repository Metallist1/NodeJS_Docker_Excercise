const path  = require('path');
require('dotenv').config({path:  path.resolve(process.cwd(), '../../.env')});

const app = require('express')();
const bodyParser = require('body-parser');
const amqp = require('amqplib');

const http = require('http');
const server = http.createServer(app);
const PORT = process.env.PORT || 3003;


let listener = require('./productListener.js');
let service = require('./productService.js');

// Middleware
app.use(bodyParser.json());

// RabbitMQ connection string
const messageQueueConnectionString = process.env.CLOUDAMQP_URL;

app.get('/product', function (req, res) {
    res.send(service.getAllProducts());
});

app.get('/product/:id', function(req, res) {
    res.send(service.getSingleProduct(req.params.id));
});

app.post('/product', function (req, res) {
    let product = req.body;
    res.send(service.createProduct(product));
})

app.put('/product/:id', function (req, res) {
    let product = req.body;
    res.send(service.editProduct(req.params.id, product));
})

app.delete('/product/:id', function (req, res) {
    res.send(service.deleteProduct(req.params.id));
});

// listen for results on RabbitMQ
// listener.listenForMessages();

server.listen(PORT, function (err) {
    console.log(messageQueueConnectionString)
    if (err) {
        console.error(err);
    } else {
        console.info("Listening on port %s.", PORT);
    }
});