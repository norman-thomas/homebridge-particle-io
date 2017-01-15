const SensorAccessory = require('./SensorAccessory.js');

class HumiditySensorAccessory extends SensorAccessory {

  constructor(log, url, accessToken, device, homebridge) {
    const Service = homebridge.hap.Service;
    const Characteristic = homebridge.hap.Characteristic;
    super(log, url, accessToken, device, homebridge, Service.HumiditySensor, Characteristic.CurrentRelativeHumidity);
  }

  setCurrentValue(value) {
    if (value < 0 || value > 100) {
      this.log('Value for humidity outside of range:', value);
    }
    super.setCurrentValue(value);
  }
}

module.exports = HumiditySensorAccessory;
