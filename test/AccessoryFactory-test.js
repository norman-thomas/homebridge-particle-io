require('should');

const dummyConfig = require('./dummyConfig.js');
const dummyHomebridge = require('./dummyHomebridge.js');

const AccessoryFactory = require('../src/AccessoryFactory.js');
const LightbulbAccessory = require('../src/LightbulbAccessory.js');
const TemperatureSensorAccessory = require('../src/TemperatureSensorAccessory.js');
const HumiditySensorAccessory = require('../src/HumiditySensorAccessory.js');


describe('AccessoryFactory.js', () => {
  describe('constructor', () => {
    it('should assign config values to member variables', () => {
      const homebridge = {};
      const devices = dummyConfig.devices;
      const dummyURL = 'https://some.random.url.com';
      const dummyAccessToken = 'MY_top_SECRET_access_TOKEN';
      const factory = new AccessoryFactory(() => {}, dummyURL, dummyAccessToken, devices, homebridge);
      factory.url.should.be.equal(dummyURL);
      factory.accessToken.should.be.equal(dummyAccessToken);
      factory.devices.should.be.deepEqual(devices);
      factory.homebridge.should.be.equal(homebridge);
    });
  });

  describe('getAccessories', () => {
    it('should assign accessories correctly', () => {
      const homebridge = dummyHomebridge(dummyConfig);
      const devices = [
        { device_id: 'abc123def456', type: 'temperaturesensor' },
        { device_id: 'abc123def456', type: 'humiditysensor' },
        { device_id: 'abc123def456', type: 'lightbulb' }
      ];
      const dummyURL = 'https://some.random.url.com';
      const dummyAccessToken = 'MY_top_SECRET_access_TOKEN';
      const factory = new AccessoryFactory(() => {}, dummyURL, dummyAccessToken, devices, homebridge);
      factory.getAccessories().should.have.length(devices.length);
      factory.getAccessories().map(accessory => accessory.constructor).should.be.deepEqual(
        [TemperatureSensorAccessory, HumiditySensorAccessory, LightbulbAccessory]
      );
    });
  });

  describe('createAccessory', () => {
    it('should create corresponding accessory', () => {
      const homebridge = dummyHomebridge(dummyConfig);
      const devices = [
        { device_id: 'abc123def456', type: 'humiditysensor' }
      ];
      const device = devices[0];
      const dummyURL = 'https://some.random.url.com';
      const dummyAccessToken = 'MY_top_SECRET_access_TOKEN';
      const factory = new AccessoryFactory(() => {}, dummyURL, dummyAccessToken, devices, homebridge);
      const accessory = factory.createAccessory(device);
      accessory.should.be.instanceOf(HumiditySensorAccessory);
      accessory.deviceId.should.be.equal(device.device_id);
      accessory.ServiceType.should.be.equal(homebridge.hap.Service.HumiditySensor);
      accessory.CharacteristicType.should.be.equal(homebridge.hap.Characteristic.CurrentRelativeHumidity);
    });
  });
});
