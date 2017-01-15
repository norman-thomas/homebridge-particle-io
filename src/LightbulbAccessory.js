const ActorAccessory = require('./ActorAccessory.js');

class LightbulbAccessory extends ActorAccessory {

  constructor(log, url, accessToken, device, homebridge) {
    const Service = homebridge.hap.Service;
    const Characteristic = homebridge.hap.Characteristic;
    super(log, url, accessToken, device, homebridge, Service.Lightbulb, Characteristic.On);
  }

  setState(value, callback) {
    super.setState(value ? '1' : '0', callback);
  }
}

module.exports = LightbulbAccessory;
