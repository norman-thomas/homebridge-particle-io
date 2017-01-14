const request = require('request');
const EventSource = require('eventsource');

let Service;
let Characteristic;


function ParticlePlatform(log, config) {
  this.log = log;
  this.accessToken = config.access_token;
  this.deviceId = config.deviceid;
  this.url = config.cloudurl;
  this.devices = config.devices;
}

function ParticleAccessory(log, url, accessToken, device) {
  this.log = log;
  this.name = device.name;
  this.args = device.args;
  this.deviceId = device.deviceid;
  this.type = device.type;
  this.functionName = device.function_name;
  this.eventName = device.event_name;
  this.sensorType = device.sensorType;
  this.key = device.key;
  this.accessToken = accessToken;
  this.url = url;
  this.value = 20;

  console.log(this.name, ' = ', this.sensorType);

  this.services = [];

  this.informationService = new Service.AccessoryInformation();

  this.informationService
  .setCharacteristic(Characteristic.Manufacturer, 'Particle')
  .setCharacteristic(Characteristic.Model, 'Photon')
  .setCharacteristic(Characteristic.SerialNumber, 'AA098BB09');

  this.services.push(this.informationService);

  if (this.type === 'LIGHT') {
    this.lightService = new Service.Lightbulb(this.name);

    this.lightService
    .getCharacteristic(Characteristic.On)
    .on('set', this.setState.bind(this));

    this.services.push(this.lightService);
  } else if (this.type === 'SENSOR') {
    let service;

    console.log('Sensor Type: ', this.sensorType.toLowerCase());

    if (this.sensorType.toLowerCase() === 'temperature') {
      console.log('Temperature Sensor');

      service = new Service.TemperatureSensor(this.name);

      service
      .getCharacteristic(Characteristic.CurrentTemperature)
      .on('get', this.getDefaultValue.bind(this));
    } else if (this.sensorType.toLowerCase() === 'humidity') {
      console.log('Humidity Sensor');

      service = new Service.HumiditySensor(this.name);

      service
      .getCharacteristic(Characteristic.CurrentRelativeHumidity)
      .on('get', this.getDefaultValue.bind(this));
    } else if (this.sensorType.toLowerCase() === 'light') {
      console.log('Light Sensor');

      service = new Service.LightSensor(this.name);

      service
      .getCharacteristic(Characteristic.CurrentAmbientLightLevel)
      .on('get', this.getDefaultValue.bind(this));
    }

    if (service !== undefined) {
      console.log('Initializing ', service.displayName, ', ', this.sensorType);

      const eventUrl = `${this.url}/${this.deviceId}/events/${this.eventName}?access_token=${this.accessToken}`;
      const es = new EventSource(eventUrl);

      console.log(eventUrl);

      es.onerror = () => {
        console.log('ERROR!');
      };

      es.addEventListener(this.eventName, this.processEventData.bind(this), false);

      this.services.push(service);
    }

    console.log('Service Count: ', this.services.length);
  }
}

ParticleAccessory.prototype.setState = (state, callback) => {
  this.log.info('Getting current state...');

  this.log.info('URL: ', this.url);
  this.log.info('Device ID: ', this.deviceId);

  const onUrl = `${this.url}/${this.deviceId}/${this.functionName}`;

  this.log.info('Calling function: ', onUrl);

  const argument = this.args.replace('{STATE}', (state ? '1' : '0'));

  request.post(
    onUrl,
    {
      form: {
        access_token: this.accessToken,
        args: argument,
      },
    },
    (error, response /* , body*/) => {
      console.log(response);

      if (!error) {
        callback();
      } else {
        callback(error);
      }
    },
  );
};

ParticleAccessory.prototype.processEventData = (e) => {
  const data = JSON.parse(e.data);
  const tokens = data.data.split('=');

  console.log(tokens[0], ' = ', tokens[1], ', ', this.services[1].displayName, ', ', this.sensorType, ', ', this.key.toLowerCase(), ', ', tokens[0].toLowerCase());
  console.log(this.services[1] !== undefined && this.key.toLowerCase() === tokens[0].toLowerCase());

  if (this.services[1] !== undefined && this.key.toLowerCase() === tokens[0].toLowerCase()) {
    if (tokens[0].toLowerCase() === 'temperature') {
      this.value = parseFloat(tokens[1]);

      this.services[1]
      .getCharacteristic(Characteristic.CurrentTemperature)
      .setValue(parseFloat(tokens[1]));
    } else if (tokens[0].toLowerCase() === 'humidity') {
      this.value = parseFloat(tokens[1]);

      this.services[1]
      .getCharacteristic(Characteristic.CurrentRelativeHumidity)
      .setValue(parseFloat(tokens[1]));
    } else if (tokens[0].toLowerCase() === 'light') {
      this.value = parseFloat(tokens[1]);

      this.services[1]
      .getCharacteristic(Characteristic.CurrentAmbientLightLevel)
      .setValue(parseFloat(tokens[1]));
    }
  }
};

ParticleAccessory.prototype.getDefaultValue = (callback) => {
  callback(null, this.value);
};

ParticleAccessory.prototype.setCurrentValue = (value, callback) => {
  console.log('Value: ', value);

  callback(null, value);
};

ParticleAccessory.prototype.getServices = () => this.services;

ParticlePlatform.prototype = {
  accessories: (callback) => {
    const foundAccessories = [];
    const count = this.devices.length;

    for (let index = 0; index < count; index += 1) {
      const accessory = new ParticleAccessory(
        this.log,
        this.url,
        this.accessToken,
        this.devices[index],
      );

      foundAccessories.push(accessory);
    }

    callback(foundAccessories);
  },
};

module.exports = (homebridge) => {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;

  homebridge.registerPlatform('homebridge-particle', 'Particle', ParticlePlatform);
};
