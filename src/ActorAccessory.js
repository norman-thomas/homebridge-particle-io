const request = require('request');
const Accessory = require('./Accessory.js');

class ActorAccessory extends Accessory {
  constructor(log, url, accessToken, device, homebridge, ServiceType, CharacteristicType) {
    super(log, url, accessToken, device, homebridge, ServiceType, CharacteristicType);

    this.functionName = device.function_name;

    const actorService = new ServiceType(this.name);
    actorService
    .getCharacteristic(CharacteristicType)
    .on('set', this.setState.bind(this))
    .on('get', this.getState.bind(this));

    this.services.push(actorService);
  }

  callParticleFunction(arg, callback, outputRAW) {
    const url = `${this.url}${this.deviceId}/${this.functionName}`;
    this.log('Calling function: "', url, '" with arg: ', arg);
    const form = {
      access_token: this.accessToken,
      arg
    };
    if (outputRAW) {
      form.format = 'raw';
    }
    request.post(
      url,
      {
        form
      },
      callback
    );
  }

  getState(callback) {
    this.callParticleFunction('?', (error, response, body) => {
      this.value = parseFloat(body);
      callback(null, this.value);
    },
    true);
  }

  setState(value, callback) {
    this.value = value;
    const arg = this.args.replace('{STATE}', value);
    this.callParticleFunction(arg, (error, response, body) => this.setStateCallback(error, response, body, callback), true);
  }

  setStateCallback(error, response, body, callback) {
    if (!error) {
      callback();
    } else {
      this.log(error);
      this.log(response);
      this.log(body);
      callback(error);
    }
  }
}

module.exports = ActorAccessory;
