const messageQueueConnectionString = process.env.CLOUDAMQP_URL;


const amqp = require('amqplib');

// utility function to publish messages to a channel
const publishToChannel = async function publishToChannel( { routingKey, exchangeName, data }) {
    var channel = await openChannel();
    return new Promise((resolve, reject) => {
        channel.publish(exchangeName, routingKey, Buffer.from(JSON.stringify(data), 'utf-8'), { persistent: true }, function (err, ok) {
            if (err) {
                return reject(err);
            }

            resolve();
        })
    });
}

async function openChannel() {
    let connection = await amqp.connect(messageQueueConnectionString);
    let channel = await connection.createConfirmChannel();
    return channel;
 }


exports.publishToChannel = publishToChannel;
