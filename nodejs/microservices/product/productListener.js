const amqp = require('amqplib');

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
        channel.consume("processing.requests", async function (msg) {
            // parse message
            let msgBody = msg.content.toString();
            let data = JSON.parse(msgBody);
            let requestId = data.requestId;
            let requestData = data.requestData;
            console.log("Received a request message, requestId:", requestId);

            // process data
            let processingResults = await processMessage(requestData);

            // publish results to channel
            await publishToChannel(resultsChannel, {
                exchangeName: "processing",
                routingKey: "result",
                data: { requestId, processingResults }
            });
            console.log("Published results for requestId:", requestId);

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

// simulate data processing that takes 1 seconds
const processMessage = function processMessage(requestData) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(requestData + "-processed")
        }, 1000);
    });
}

exports.listenForMessages = listenForMessages;
exports.publishToChannel = publishToChannel;
exports.consume = consume;
exports.processMessage = processMessage;