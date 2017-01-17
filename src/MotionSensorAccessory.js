const SensorAccessory = require('./SensorAccessory.js');

class MotionSensorAccessory extends SensorAccessory {

  constructor(log, url, accessToken, device, homebridge) {
    const Service = homebridge.hap.Service;
    const Characteristic = homebridge.hap.Characteristic;
    super(log, url, accessToken, device, homebridge, Service.MotionSensor, Characteristic.MotionDetected);
  }

  setCurrentValue(value) {
    if (!(value in [0, 1])) {
      this.log('Unexpected value for motion detected:', value);
    }
    super.setCurrentValue(value);
  }
}

module.exports = MotionSensorAccessory;
