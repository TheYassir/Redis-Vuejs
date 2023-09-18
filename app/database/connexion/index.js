const { createClient } = require('redis');

const client = createClient({
    socket: {
        host: 'redisserver',
        port: 6379,
    },
});

client.on('error', err => console.log('Redis Client Error', err));

client.connect().then(() => console.log('Redis Client connected'));

module.exports = client;
