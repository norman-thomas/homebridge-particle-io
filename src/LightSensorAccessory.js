const SensorAccessory = require('./SensorAccessory.js');

class LightSensorAccessory extends SensorAccessory {

  constructor(log, url, accessToken, device, homebridge) {
    const Service = homebridge.hap.Service;
    const Characteristic = homebridge.hap.Characteristic;
    super(log, url, accessToken, device, homebridge, Service.LightSensor, Characteristic.CurrentAmbientLightLevel);
  }

  setCurrentValue(value) {
    if (value < 0) {
      this.log('Value for ambient light level outside of range:', value);
    }
    super.setCurrentValue(value);
  }
}

module.exports = LightSensorAccessory;
