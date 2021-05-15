const path  = require('path');
require('dotenv').config({path:  path.resolve(process.cwd(), '../../.env')});

const app = require('express')();
const bodyParser = require('body-parser');
const amqp = require('amqplib');

const http = require('http');
const server = http.createServer(app);
const PORT = process.env.PORT || 3002;


let listener = require('./orderListener.js');
let service = require('./orderService.js');

// Middleware
app.use(bodyParser.json());

// RabbitMQ connection string
const messageQueueConnectionString = process.env.CLOUDAMQP_URL;

app.get('/order', function (req, res) {
    res.send(service.getAllOrders());
});

app.get('/order/:id', function(req, res) {
    res.send(service.getSingleOrder(req.params.id));
});

app.post('/order', function (req, res) {
    let order = req.body;
    service.createOrder(order).then((value) => {
        res.send(value);
      });
});

app.put('/order/:id/pay', function (req, res) {
    let order = service.getSingleOrder(req.params.id)
    order.status = 'paid';
    res.send(service.editOrder(req.params.id, order));
});

app.put('/order/:id/ship', function (req, res) {
    let order = service.getSingleOrder(req.params.id)
    order.status = 'shipped';
    res.send(service.editOrder(req.params.id, order));
});

app.put('/order/:id/cancel', function (req, res) {
    let order = service.getSingleOrder(req.params.id)
    order.status = 'canceled';
    res.send(service.editOrder(req.params.id, order));
});

app.delete('/order/:id', function (req, res) {
    res.send(service.deleteOrder(req.params.id));
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