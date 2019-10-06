'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mqtt = require('./mqtt');
const db = require('./db');

let devices = [];

console.log(mqtt);

// Import the appropriate service
const { smarthome } = require('actions-on-google');

// Create an app instance
const app = smarthome();

// Register handlers for Smart Home intents

app.onExecute((body, headers) => {
  console.log('onExecute');
  console.log(body);

  const ids = [];

  for (const input of body.inputs) {
    if (input.intent === 'action.devices.EXECUTE') {
      for (const command of input.payload.commands) {
        for (const device of command.devices) {
          for (const execution of command.execution) {
            mqtt.sendCommand('test', {
              id: device.id,
              command: execution.command,
              params: execution.params
            });

            ids.push(device.id);
          }
        }
      }
    }
  }

  return {
    requestId: body.requestId,
    payload: {
      commands: [
        {
          ids,
          status: 'SUCCESS'
        }
      ]
    }
  };
});

app.onQuery((body, headers) => {
  console.log('onQuery');
  return {
    requestId: 'ff36...',
    payload: {
      // ...
    }
  };
});

app.onSync((body, headers) => {
  console.log('onSync');
  const token = headers.authorization;
  console.log(`token = ${token}`);

  const ds = [];
  for (const d of devices) {
    ds.push({
      id: d.id,
      type: 'action.devices.types.LIGHT',
      traits: [
        'action.devices.traits.OnOff',
        'action.devices.traits.Brightness',
        'action.devices.traits.ColorSetting'
      ],
      name: {
        defaultNames: [d.name],
        name: d.name,
        nicknames: [d.name]
      },
      willReportState: false,
      roomHint: 'bedroom'
    });
  }

  return {
    requestId: body.requestId,
    payload: {
      agentUserId: '1836.15267389',
      devices: ds
    }
  };
});

mqtt.on('gw-init', (gwId, ds) => {
  devices = ds;
  console.log(gwId, JSON.stringify(devices));
});

const expressApp = express().use(bodyParser.json());
expressApp.post('/fulfillment', app);
expressApp.listen(8888);
