let service = require('./productService.js');
const amqp = require('amqplib');

const messageQueueConnectionString = process.env.CLOUDAMQP_URL;


const listenForMessages = async function listenForMessages() {
    // connect to Rabbit MQ
    let connection = await amqp.connect(messageQueueConnectionString);

    // create a channel and prefetch 1 message at a time
    let channel = await connection.createChannel();
    await channel.prefetch(1);

    // create a second channel to send back the results
    let resultsChannel = await connection.createConfirmChannel();

    // start consuming messages
    await consume({ connection, channel, resultsChannel });
}

// utility function to publish messages to a channel
const publishToChannel = function publishToChannel(channel, { routingKey, exchangeName, data }) {
    return new Promise((resolve, reject) => {
        channel.publish(exchangeName, routingKey, Buffer.from(JSON.stringify(data), 'utf-8'), { persistent: true }, function (err, ok) {
            if (err) {
                return reject(err);
            }

            resolve();
        })
    });
}

// consume messages from RabbitMQ
const consume = function consume({ connection, channel, resultsChannel }) {
    return new Promise((resolve, reject) => {
        channel.consume("orders.completed", async function (msg) {
            // parse message
            let msgBody = msg.content.toString();
            let data = JSON.parse(msgBody);
            let requestId = data.requestId;
            let requestData = data.requestData;
            console.log("Received a request message, requestId:", requestId);

            // process data
            HandleOrderComplete(requestId, requestData);

            // acknowledge message as processed successfully
            await channel.ack(msg);
        });

        channel.consume("orders.cancelled", async function (msg) {
            // parse message
            let msgBody = msg.content.toString();
            let data = JSON.parse(msgBody);
            let requestId = data.requestId;
            let requestData = data.requestData;
            console.log("Received a request message, requestId:", requestId);

            // process data
            HandleOrderCanceled(requestId, requestData);

            // acknowledge message as processed successfully
            await channel.ack(msg);
        });

        channel.consume("orders.shipped", async function (msg) {
            // parse message
            let msgBody = msg.content.toString();
            let data = JSON.parse(msgBody);
            let requestId = data.requestId;
            let requestData = data.requestData;
            console.log("Received a request message, requestId:", requestId);

            // process data
            HandleOrderShipped(requestId, requestData);

            // acknowledge message as processed successfully
            await channel.ack(msg);
        });
        // handle connection closed
        connection.on("close", (err) => {
            return reject(err);
        });

        // handle errors
        connection.on("error", (err) => {
            return reject(err);
        });
    });
}


async function HandleOrderComplete(id, message) {
    await message.forEach(element => {
        var product = service.getSingleProduct(element.productId);
        product.itemsReserved += element.quantity;
        service.editProduct(element.productId, product);
    });
}

async function HandleOrderCanceled(id, message) {
    await message.forEach(element => {
        var product = service.getSingleProduct(element.productId);
        product.itemsReserved -= element.quantity;
        service.editProduct(element.productId, product);
    });
}

async function HandleOrderShipped(id, message) {
    await message.forEach(element => {
        var product = service.getSingleProduct(element.productId);
        product.itemsReserved -= element.quantity;
        product.itemsInStock -= element.quantity;
        service.editProduct(element.productId, product);
    });
}

exports.listenForMessages = listenForMessages;
exports.publishToChannel = publishToChannel;
exports.consume = consume;
