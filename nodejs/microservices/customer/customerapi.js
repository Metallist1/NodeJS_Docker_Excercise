const path  = require('path');
require('dotenv').config({path:  path.resolve(process.cwd(), '../../.env')});

const app = require('express')();
const bodyParser = require('body-parser');
const amqp = require('amqplib');

const http = require('http');
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;


let listener = require('./customerListener.js');
let service = require('./customerService.js');

// Middleware
app.use(bodyParser.json());

// RabbitMQ connection string
const messageQueueConnectionString = process.env.CLOUDAMQP_URL;

app.get('/customer/:id', function(req, res) {
    res.send(service.getSingleCustomer(req.params.id));
});

app.post('/customer', function (req, res) {
    let customer = req.body;
    res.send(service.createCustomer(customer));
})

app.put('/customer/:id', function (req, res) {
    let customer = req.body;
    res.send(service.editCustomer(req.params.id, customer));
})

app.delete('/customer/:id', function (req, res) {
    res.send(service.deleteCustomer(req.params.id));
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
