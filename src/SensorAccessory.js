const EventSource = require('eventsource');
const Accessory = require('./Accessory.js');

class SensorAccessory extends Accessory {
  constructor(log, url, accessToken, device, homebridge, ServiceType, CharacteristicType) {
    super(log, url, accessToken, device, homebridge, ServiceType, CharacteristicType);

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
      result, ',',
      service.displayName, ',',
      this.type, ',',
      this.key.toLowerCase()
    );

    this.setCurrentValue(this.parseValue(result));
    service
    .getCharacteristic(this.CharacteristicType)
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

module.exports = SensorAccessory;
