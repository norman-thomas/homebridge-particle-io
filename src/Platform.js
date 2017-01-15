const AccessoryFactory = require('./AccessoryFactory.js');

class ParticlePlatform {

  constructor(log, config) {
    this.log = log;
    this.accessToken = config.access_token;
    this.url = config.cloud_url;
    this.devices = config.devices;
    this.accessoryFactory = new AccessoryFactory(log, this.url, this.accessToken, this.devices, global.homebridge);
  }

  accessories(callback) {
    const foundAccessories = this.accessoryFactory.getAccessories();
    callback(foundAccessories);
  }
}

module.exports = ParticlePlatform;
