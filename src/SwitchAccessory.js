const ActorAccessory = require('./ActorAccessory.js');

class SwitchAccessory extends ActorAccessory {

  constructor(log, url, accessToken, device, homebridge) {
    const Service = homebridge.hap.Service;
    const Characteristic = homebridge.hap.Characteristic;
	this.functionName = device.function_name;
    super(log, url, accessToken, device, homebridge, Service.Switch, Characteristic.On);
  }

  setState(value, callback) {
    super.setState(this.functionName, value ? '1' : '0', callback);
  }
}

module.exports = SwitchAccessory;
