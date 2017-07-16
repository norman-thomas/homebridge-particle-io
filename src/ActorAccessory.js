const request = require('request');
const Accessory = require('./Accessory.js');

class ActorAccessory extends Accessory {

  constructor(log, url, accessToken, device, homebridge, ServiceType, CharacteristicType) {
    super(log, url, accessToken, device, homebridge, ServiceType, CharacteristicType);

    this.actorService = new ServiceType(this.name);
    this.actorService.getCharacteristic(CharacteristicType)
                     .on('set', this.setState.bind(this))
                     .on('get', this.getState.bind(this));

    this.services.push(this.actorService);
  }

  callParticleFunction(functionName, arg, callback, outputRAW) {
    const url = `${this.url}${this.deviceId}/${functionName}`;
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

  getState(functionName, callback) {
    this.callParticleFunction(functionName, '?', (error, response, body) => {
      this.value = parseFloat(body);
      callback(null, this.value);
    },
    true);
  }

  setState(functionName, value, callback) {
    this.value = value;
    this.callParticleFunction(functionName, value, (error, response, body) => this.callbackHelper(error, response, body, callback), true);
  }

  callbackHelper(error, response, body, callback) {
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
