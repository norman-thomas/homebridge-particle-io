const EventSource = require('eventsource');
const Accessory = require('./Accessory.js');

class SensorAccessory extends Accessory {
  constructor(log, url, accessToken, device, homebridge, ServiceType, CharacteristicType) {
    super(log, url, accessToken, device, homebridge, ServiceType, CharacteristicType);

    this.eventName = device.event_name;
    this.key = device.key;
    this.unit = null;

    this.eventUrl = `${this.url}${this.deviceId}/events/${this.eventName}?access_token=${this.accessToken}`;
    this.log('Listening for events from:', this.eventUrl);

    const events = new EventSource(this.eventUrl);
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

    this.log(
      result, '-',
      service.displayName, '-',
      this.type
    );

    this.setCurrentValue(parseFloat(result));
    service
    .getCharacteristic(this.CharacteristicType)
    .setValue(this.value);
  }

  setCurrentValue(value) {
    this.value = value;
  }

  getCurrentValue(callback) {
    callback(null, this.value);
  }
}

module.exports = SensorAccessory;
