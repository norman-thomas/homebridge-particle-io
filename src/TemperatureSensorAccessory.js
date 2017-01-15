const SensorAccessory = require('./Accessory.js').SensorAccessory;

class TemperatureSensorAccessory extends SensorAccessory {

  constructor(log, device, homebridge) {
    const Service = homebridge.hap.Service;
    const Characteristic = homebridge.hap.Characteristic;
    super(log, device, homebridge, Service.TemperatureSensor, Characteristic.CurrentTemperature);
  }

  setCurrentValue(value) {
    if (value < -255 || value > 100) {
      this.log.warning('Value for temperature outside of range:', value);
    }
    super.setCurrentValue(value);
  }
}

module.exports = TemperatureSensorAccessory;
