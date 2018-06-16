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

  getState(callback) {
    this.callParticleFunction(this.functionName, '?', (error, response, body) => {
      this.value = parseInt(body);
      try {
        callback(null, this.value);
      } catch (error) {
        this.log('Caught error '+ error + ' when calling homebridge callback.');
      }
    },
    true);
  }
}

module.exports = SwitchAccessory;
