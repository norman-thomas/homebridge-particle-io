const ActorAccessory = require('./Accessory.js').ActorAccessory;

class LightbulbAccessory extends ActorAccessory {

  constructor(log, device, homebridge) {
    const Service = homebridge.hap.Service;
    const Characteristic = homebridge.hap.Characteristic;
    super(log, device, homebridge, Service.Lightbulb, Characteristic.On);
  }

  setState(value, callback) {
    super.setState(value ? '1' : '0', callback);
  }
}

module.exports = LightbulbAccessory;
