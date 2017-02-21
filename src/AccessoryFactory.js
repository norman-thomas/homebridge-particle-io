const LightbulbAccessory = require('./LightbulbAccessory.js');
const SwitchAccessory = require('./SwitchAccessory.js');
const HumiditySensorAccessory = require('./HumiditySensorAccessory.js');
const TemperatureSensorAccessory = require('./TemperatureSensorAccessory.js');
const LightSensorAccessory = require('./LightSensorAccessory.js');
const MotionSensorAccessory = require('./MotionSensorAccessory.js');

const accessoryRegistry = {
  lightbulb: LightbulbAccessory,
  switch: SwitchAccessory,
  temperaturesensor: TemperatureSensorAccessory,
  humiditysensor: HumiditySensorAccessory,
  lightsensor: LightSensorAccessory,
  motionsensor: MotionSensorAccessory
};

class AccessoryFactory {

  constructor(log, url, accessToken, devices, homebridge) {
    this.log = log;
    this.url = url;
    this.accessToken = accessToken;
    this.devices = devices;
    this.homebridge = homebridge;
  }

  getAccessories() {
    const validDevices = this.devices.filter(device => device.type.toLowerCase() in accessoryRegistry);
    return validDevices.map(device => this.createAccessory(device));
  }

  createAccessory(device) {
    return new accessoryRegistry[device.type.toLowerCase()](
      this.log, this.url, this.accessToken, device, this.homebridge
    );
  }
}

module.exports = AccessoryFactory;
