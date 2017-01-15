const LightbulbAccessory = require('./LightbulbAccessory.js');
const HumiditySensorAccessory = require('./HumiditySensorAccessory.js');
const TemperatureSensorAccessory = require('./TemperatureSensorAccessory.js');

const accessoryRegistry = {
  lightbulb: LightbulbAccessory,
  temperaturesensor: TemperatureSensorAccessory,
  humiditysensor: HumiditySensorAccessory
};

class AccessoryFactory {

  constructor(log, url, accessToken, devices, homebridge) {
    this.log = log;
    this.accessToken = accessToken;
    this.devices = devices;
    this.homebridge = homebridge;
  }

  getAccessories() {
    const validDevices = this.devices.filter(device => device.type.toLowerCase() in accessoryRegistry);
    return validDevices.map(device => this.createAccessory(device));
  }

  createAccessory(device) {
    return new accessoryRegistry[device.type.toLowerCase()](this.log, this.url, this.accessToken, device, this.homebridge);
  }
}

module.exports = AccessoryFactory;
