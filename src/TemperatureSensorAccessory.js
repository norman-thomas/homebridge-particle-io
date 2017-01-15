const SensorAccessory = require('./SensorAccessory.js');

class TemperatureSensorAccessory extends SensorAccessory {

  constructor(log, url, accessToken, device, homebridge) {
    const Service = homebridge.hap.Service;
    const Characteristic = homebridge.hap.Characteristic;
    super(log, url, accessToken, device, homebridge, Service.TemperatureSensor, Characteristic.CurrentTemperature);
  }

  setCurrentValue(value) {
    if (value < -255 || value > 100) {
      this.log('Value for temperature outside of range:', value);
    }
    super.setCurrentValue(value);
  }
}

module.exports = TemperatureSensorAccessory;
