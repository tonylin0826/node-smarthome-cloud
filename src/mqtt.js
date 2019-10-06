const aedes = require('aedes')();
const events = require('events');
const server = require('net').createServer(aedes.handle);
const port = 1883;

const mqtt = new events.EventEmitter();

aedes.on('clientError', (client, err) => {
  console.log('client error', client.id, err.message, err.stack);
});

aedes.on('connectionError', (client, err) => {
  console.log('client error', client, err.message, err.stack);
});

aedes.on('publish', (packet, client) => {
  if (!client) {
    return;
  }

  if (packet.topic.indexOf('init')) {
    const gwId = packet.topic.split('/')[1];
    mqtt.emit('gw-init', gwId, JSON.parse(packet.payload.toString()));
  }

  // console.log(packet);
});

aedes.on('subscribe', (subscriptions, client) => {
  if (client) {
    console.log('subscribe from client', subscriptions, client.id);
  }
});

aedes.on('client', (client) => {
  console.log('new client', client.id);
});

server.listen(port, () => {
  console.log('server listening on port', port);
});

mqtt.sendCommand = (gwId, payload) => {
  aedes.publish({
    cmd: 'publish',
    qos: 2,
    topic: `gw/${gwId}/command`,
    payload: new Buffer(JSON.stringify(payload)),
    retain: false
  })
};

module.exports = mqtt;