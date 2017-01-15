const request = require('request');
const Accessory = require('./Accessory.js');

class ActorAccessory extends Accessory {
  constructor(log, url, accessToken, device, homebridge, ServiceType, CharacteristicType) {
    super(log, url, accessToken, device, homebridge, ServiceType, CharacteristicType);
    this.functionName = device.function_name;

    const actorService = new ServiceType(this.name);
    actorService
    .getCharacteristic(CharacteristicType)
    .on('set', this.setState.bind(this));

    this.services.push(actorService);
  }

  setState(value, callback) {
    const url = `${this.url}${this.deviceId}/${this.functionName}`;
    this.log.info('Setting current state via: ', url);

    const argument = this.args.replace('{STATE}', value);
    request.post(
      url,
      {
        form: {
          access_token: this.accessToken,
          args: argument
        }
      },
      (error, response, body) => {
        if (!error) {
          this.log(response);
          callback();
        } else {
          this.log.error(error);
          this.log.error(response);
          this.log.error(body);
          callback(error);
        }
      }
    );
  }
}

module.exports = ActorAccessory;
