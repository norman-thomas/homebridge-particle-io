require('should');
const sinon = require('sinon');
const request = require('request');

const dummyConfig = require('./dummyConfig.js');
const dummyHomebridge = require('./dummyHomebridge.js');

const ActorAccessory = require('../src/ActorAccessory.js');


describe('ActorAccessory.js', () => {
  describe('constructor', () => {
    it('should assign config values to member variables', () => {
      const homebridge = dummyHomebridge(dummyConfig);
      const device = dummyConfig.devices[0];
      const dummyURL = 'https://some.random.url.com';
      const dummyAccessToken = 'MY_top_SECRET_access_TOKEN';
      const Service = homebridge.hap.Service;
      const Characteristic = homebridge.hap.Characteristic;
      const accessory = new ActorAccessory(
        () => {}, dummyURL, dummyAccessToken, device, homebridge, Service.Lightbulb, Characteristic.On
      );
      accessory.url.should.be.equal(dummyURL);
      accessory.accessToken.should.be.equal(dummyAccessToken);
      accessory.deviceId.should.be.equal(device.device_id);
      accessory.functionName.should.be.equal(device.function_name);

      accessory.services.should.have.length(2);
      accessory.services[1].should.be.an.instanceOf(Service.Lightbulb);
    });
  });

  describe('setState', () => {
    before(() => {
      sinon.spy(request, 'post');
    });

    after(() => {
      request.post.restore();
    });

    it('should send value', () => {
      const homebridge = dummyHomebridge(dummyConfig);
      const device = dummyConfig.devices[0];
      const dummyURL = 'https://some.random.url.com';
      const dummyAccessToken = 'MY_top_SECRET_access_TOKEN';
      const Service = homebridge.hap.Service;
      const Characteristic = homebridge.hap.Characteristic;
      const accessory = new ActorAccessory(
        () => {}, dummyURL, dummyAccessToken, device, homebridge, Service.Lightbulb, Characteristic.On
      );
      const spy = sinon.spy();
      const value = 17.9;
      accessory.setState(value, spy);
      spy.should.be.calledOnce;
      // FIXME fix the following assertions
      spy.calledWith(123).should.be.true;
      request.post.should.be.calledOnce;
      request.post.calledWith(55).should.be.true;
    });
  });
});
