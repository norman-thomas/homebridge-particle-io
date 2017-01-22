require('should');
const sinon = require('sinon');
const chai = require('chai');
chai.use(require('sinon-chai'));

const expect = chai.expect;

const dummyConfig = require('./dummyConfig.js');
const dummyHomebridge = require('./dummyHomebridge.js');

const SensorAccessory = require('../src/SensorAccessory.js');


describe('SensorAccessory.js', () => {
  describe('constructor', () => {
    it('should assign config values to member variables', () => {
      const homebridge = dummyHomebridge(dummyConfig);
      const device = dummyConfig.devices[3];
      const dummyURL = 'https://some.random.url.com/';
      const dummyAccessToken = 'MY_top_SECRET_access_TOKEN';
      const Service = homebridge.hap.Service;
      const Characteristic = homebridge.hap.Characteristic;
      const accessory = new SensorAccessory(
        () => {},
        dummyURL,
        dummyAccessToken,
        device,
        homebridge,
        Service.HumiditySensor,
        Characteristic.CurrentRelativeHumidity
      );
      accessory.eventName.should.be.equal(device.event_name);
      accessory.eventUrl.should.be.equal(
        'https://some.random.url.com/1234567890abcdef/events/humidity?access_token=MY_top_SECRET_access_TOKEN'
      );

      accessory.services.should.have.length(2);
      accessory.services[1].should.be.an.instanceOf(Service.HumiditySensor);
    });
  });

  describe('member functions', () => {
    let accessory;
    let Service;
    let Characteristic;

    before(() => {
      const homebridge = dummyHomebridge(dummyConfig);
      const device = dummyConfig.devices[3];
      const dummyURL = 'https://some.random.url.com/';
      const dummyAccessToken = 'MY_top_SECRET_access_TOKEN';
      Service = homebridge.hap.Service;
      Characteristic = homebridge.hap.Characteristic;
      accessory = new SensorAccessory(
        () => {},
        dummyURL,
        dummyAccessToken,
        device,
        homebridge,
        Service.HumiditySensor,
        Characteristic.CurrentRelativeHumidity
      );
    });

    it('setCurrentValue should set value', () => {
      accessory.setCurrentValue(88.8);
      accessory.value.should.be.equal(88.8);
    });

    it('getCurrentValue should call callback with value', () => {
      const spy = sinon.spy();
      accessory.value = 77.7;
      accessory.getCurrentValue(spy);
      expect(spy).to.have.been.calledOnce;
      expect(spy).to.have.been.calledWith(null, 77.7);
    });

    it.skip('processEventData', () => {
    });

    it.skip('processEventError', () => {
    });
  });
});
