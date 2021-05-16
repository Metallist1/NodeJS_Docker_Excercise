require('dotenv').config();

const amqp = require('amqplib');

// RabbitMQ connection string
const messageQueueConnectionString = process.env.CLOUDAMQP_URL;

async function setup() {
    console.log("Setting up RabbitMQ Exchanges/Queues");
    // connect to RabbitMQ Instance
    let connection = await amqp.connect(messageQueueConnectionString);

    // create a channel
    let channel = await connection.createChannel();

    // create exchange
    await channel.assertExchange("orders", "direct", { durable: true });

    // create queues
    await channel.assertQueue("orders.completed", { durable: true });
    await channel.assertQueue("orders.cancelled", { durable: true });
    await channel.assertQueue("orders.shipped", { durable: true });
    await channel.assertQueue("orders.paid", { durable: true });

    // bind queues
    await channel.bindQueue("orders.paid","orders", "paid");
    await channel.bindQueue("orders.cancelled","orders", "cancel");
    await channel.bindQueue("orders.shipped","orders", "ship");
    await channel.bindQueue("orders.completed","orders", "complete");


    console.log("Setup DONE");
    process.exit();
}

setup();
