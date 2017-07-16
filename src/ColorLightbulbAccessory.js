const ActorAccessory = require('./DimmableLightbulbAccessory.js');

class ColorLightbulbAccessory extends DimmableLightbulbAccessory {

  constructor(log, url, accessToken, device, homebridge) {
    const Service = homebridge.hap.Service;
    const Characteristic = homebridge.hap.Characteristic;
    super(log, url, accessToken, device, homebridge);

		this.actorService.getCharacteristic(Characteristic.Hue)
  		               .on('set', this.setHue.bind(this))
                     .on('get', this.getHue.bind(this));
    this.hueFunctionName = "hue"

    this.actorService.getCharacteristic(Characteristic.Saturation)
                     .on('set', this.setSaturation.bind(this))
                     .on('get', this.getSaturation.bind(this));
    this.saturationFunctionName = "saturation"
  }

  setHue(value, callback) {
    this.hue = value;
    this.callParticleFunction(this.hueFunctionName, value, (error, response, body) => this.callbackHelper(error, response, body, callback), true);
  }

  getHue(callback) {
    this.callParticleFunction(this.hueFunctionName, '?', (error, response, body) => {
      this.hue = parseInt(body);
      callback(null, this.hue);
    },
    true);
  }

  setSaturation(value, callback) {
    this.saturation = value;
    this.callParticleFunction(this.saturationFunctionName, value, (error, response, body) => this.callbackHelper(error, response, body, callback), true);
  }

  getSaturation(callback) {
    this.callParticleFunction(this.saturationFunctionName, '?', (error, response, body) => {
      this.saturation = parseInt(body);
      callback(null, this.saturation);
    },
    true);
  }

}

module.exports = ColorLightbulbAccessory;
