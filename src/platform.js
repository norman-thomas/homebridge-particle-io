const ParticleAccessory = require('./accessory.js');

class ParticlePlatform {

  constructor(log, config) {
    this.log = log;
    this.accessToken = config.access_token;
    this.deviceId = config.deviceid;
    this.url = config.cloudurl;
    this.devices = config.devices;
  }

  accessories(callback) {
    const foundAccessories = [];
    const count = this.devices.length;

    for (let index = 0; index < count; index += 1) {
      const accessory = new ParticleAccessory(
        this.log,
        this.url,
        this.accessToken,
        this.devices[index],
        global.homebridge
      );

      foundAccessories.push(accessory);
    }

    callback(foundAccessories);
  }
}

module.exports = ParticlePlatform;
