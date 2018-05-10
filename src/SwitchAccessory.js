const ActorAccessory = require('./ActorAccessory.js');

class SwitchAccessory extends ActorAccessory {

  constructor(log, url, accessToken, device, homebridge) {
    const Service = homebridge.hap.Service;
    const Characteristic = homebridge.hap.Characteristic;
    super(log, url, accessToken, device, homebridge, Service.Switch, Characteristic.On);
    this.functionName = device.function_name;
  }

  setState(value, callback) {
    super.setState(this.functionName, value ? '1' : '0', callback);
  }
}

module.exports = SwitchAccessory;
