require('should');
const sinon = require('sinon');

const dummyConfig = require('./dummyConfig.js');
const dummyHomebridge = require('./dummyHomebridge.js');

const Platform = require('../src/Platform.js');
const AccessoryFactory = require('../src/AccessoryFactory.js');
const Accessory = require('../src/Accessory.js');
const SwitchAccessory = require('../src/SwitchAccessory.js');
const LightbulbAccessory = require('../src/LightbulbAccessory.js');
const TemperatureSensorAccessory = require('../src/TemperatureSensorAccessory.js');
const HumiditySensorAccessory = require('../src/HumiditySensorAccessory.js');
const LightSensorAccessory = require('../src/LightSensorAccessory.js');
const MotionSensorAccessory = require('../src/MotionSensorAccessory.js');

global.homebridge = dummyHomebridge(dummyConfig);


describe('Platform.js', () => {
  describe('constructor', () => {
    it('should assign config values to member variables', () => {
      const platform = new Platform(() => {}, dummyConfig);
      platform.accessToken.should.be.equal(dummyConfig.access_token);
      platform.url.should.be.equal(dummyConfig.cloud_url);
      platform.devices.length.should.be.equal(dummyConfig.devices.length);
      platform.accessoryFactory.should.not.be.undefined;
      platform.accessoryFactory.should.be.an.instanceOf(AccessoryFactory);
    });
  });

  describe('accessories', () => {
    it('should report accessories correctly', () => {
      const platform = new Platform(() => {}, dummyConfig);
      const accessoryCallbackSpy = sinon.spy();
      platform.accessories(accessoryCallbackSpy);
      accessoryCallbackSpy.should.have.been.calledOnce;
      const args = accessoryCallbackSpy.args[0][0];
      args.length.should.be.equal(dummyConfig.devices.length);
      args.forEach(arg => arg.should.be.an.instanceOf(Accessory));
      args.map(arg => arg.constructor).should.be.deepEqual(
        [
          LightbulbAccessory,
          LightbulbAccessory,
          TemperatureSensorAccessory,
          HumiditySensorAccessory,
          LightSensorAccessory,
          MotionSensorAccessory,
          SwitchAccessory
        ]
      );
    });
  });
});
