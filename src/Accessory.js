const request = require('request');
const EventSource = require('eventsource');

class Accessory {

  constructor(log, device, homebridge) {
    this.log = log;
    this.homebridge = homebridge;

    this.name = device.name;
    this.args = device.args;
    this.deviceId = device.device_id;
    this.fakeSerial = device.device_id.slice(-8).toUpperCase();
    this.type = device.type.toLowerCase();

    const Service = homebridge.hap.Service;
    const Characteristic = homebridge.hap.Characteristic;
    this.informationService = new Service.AccessoryInformation();
    this.informationService
    .setCharacteristic(Characteristic.Manufacturer, 'Particle')
    .setCharacteristic(Characteristic.Model, 'Photon')
    .setCharacteristic(Characteristic.SerialNumber, this.fakeSerial);

    this.services = [];
    this.services.push(this.informationService);
  }

  getServices() {
    return this.services;
  }
}

class ActorAccessory extends Accessory {
  constructor(log, device, homebridge, ServiceType, CharacteristicType) {
    super(log, device, homebridge);
    this.functionName = device.function_name;

    const actorService = new ServiceType(this.name);
    actorService
    .getCharacteristic(CharacteristicType)
    .on('set', this.setState.bind(this));

    this.services.push(actorService);
  }

  setState(value, callback) {
    const url = `${this.url}${this.deviceId}/${this.functionName}`;
    this.log.info('Setting current state via: ', url);

    const argument = this.args.replace('{STATE}', value);
    request.post(
      url,
      {
        form: {
          access_token: this.accessToken,
          args: argument
        }
      },
      (error, response, body) => {
        if (!error) {
          this.log(response);
          callback();
        } else {
          this.log.error(error);
          this.log.error(response);
          this.log.error(body);
          callback(error);
        }
      }
    );
  }
}

class SensorAccessory extends Accessory {
  constructor(log, device, homebridge, ServiceType, CharacteristicType) {
    super(log, device, homebridge);

    this.eventName = device.event_name;
    this.key = device.key || null;
    this.value = null;
    this.unit = null;

    const eventUrl = `${this.url}${this.deviceId}/events/${this.eventName}?access_token=${this.accessToken}`;
    this.log.info('Listening for events from:', eventUrl);

    const events = new EventSource(eventUrl);
    events.addEventListener(this.eventName, this.processEventData.bind(this));
    events.onerror = this.processEventError.bind(this);

    const sensorService = new ServiceType(this.name);
    sensorService
    .getCharacteristic(CharacteristicType)
    .on('get', this.getCurrentValue.bind(this));

    this.services.push(sensorService);
  }

  processEventError(error) {
    this.log('ERROR!', error);
  }

  processEventData(e) {
    const data = JSON.parse(e.data);
    const result = this.key ? data.data.split('=')[1] : data.data;

    if (this.services.length < 2) {
      return;
    }

    const service = this.services[1];

    this.log.info(
      result, ', ',
      service.displayName, ', ',
      this.sensorType, ', ',
      this.key.toLowerCase()
    );

    this.setCurrentValue(this.parseValue(result));
    service
    .getCharacteristic(this.characteristic)
    .setValue(this.value);
  }

  static parseValue(s) {
    return parseFloat(s);
  }

  setCurrentValue(value) {
    this.value = value;
  }

  getCurrentValue(callback) {
    callback(null, this.value);
  }
}


module.exports.ActorAccessory = ActorAccessory;
module.exports.SensorAccessory = SensorAccessory;
