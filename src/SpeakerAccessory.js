const ActorAccessory = require('./ActorAccessory.js');

class SpeakerAccessory extends ActorAccessory {

  constructor(log, url, accessToken, device, homebridge) {
    const Service = homebridge.hap.Service;
    const Characteristic = homebridge.hap.Characteristic;
    super(log, url, accessToken, device, homebridge, Service.Speaker, Characteristic.Mute);
    this.actorService.getCharacteristic(Characteristic.Volume)
                     .on('set', this.setVolume.bind(this))
                     .on('get', this.getVolume.bind(this));
    this.volumeFunctionName = 'volume';
  }

  setState(value, callback) {
    super.setState(value ? '1' : '0', callback);
  }

  setVolume(value, callback) {
    this.volume = value;
    this.callParticleFunction(this.volumeFunctionName, value,
                              (error, response, body) => this.callbackHelper(error, response, body, callback), true);
  }

  getVolume(callback) {
    this.callParticleFunction(this.volumeFunctionName, '?', (error, response, body) => {
      this.volume = parseInt(body, 10);
      try {
        callback(null, this.volume);
      } catch (err) {
        this.log(`Caught error ${err} when calling homebridge callback.`);
      }
    },
    true);
  }

}

module.exports = LightbulbAccessory;
