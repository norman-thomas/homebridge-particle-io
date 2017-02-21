require('should');
const sinon = require('sinon');
const chai = require('chai');
const request = require('request');
chai.use(require('sinon-chai'));

const expect = chai.expect;

const dummyConfig = require('./dummyConfig.js');
const dummyHomebridge = require('./dummyHomebridge.js');

const ActorAccessory = require('../src/ActorAccessory.js');


describe('ActorAccessory.js', () => {
  describe('constructor', () => {
    it('should assign config values to member variables', () => {
      const homebridge = dummyHomebridge(dummyConfig);
      const device = dummyConfig.devices[0];
      const dummyURL = 'https://some.random.url.com/';
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
    let accessory;
    let Service;
    let Characteristic;

    beforeEach(() => {
      const homebridge = dummyHomebridge(dummyConfig);
      const device = dummyConfig.devices[0];
      const dummyURL = 'https://some.random.url.com/';
      const dummyAccessToken = 'MY_top_SECRET_access_TOKEN';
      Service = homebridge.hap.Service;
      Characteristic = homebridge.hap.Characteristic;
      accessory = new ActorAccessory(
        () => {}, dummyURL, dummyAccessToken, device, homebridge, Service.Lightbulb, Characteristic.On
      );
    });

    it('should send value', () => {
      sinon.stub(request, 'post');
      const value = 17.9;
      accessory.setState(value, () => {});

      expect(request.post).to.have.been.calledOnce;
      expect(request.post).to.have.been.calledWith(
        'https://some.random.url.com/abcdef1234567890/onoff',
        {
          form: {
            access_token: 'MY_top_SECRET_access_TOKEN',
            arg: 'value=17.9',
            format: 'raw'
          }
        }
      );
      request.post.restore();
    });

    it('should call the callback function', () => {
      const spy = sinon.spy();
      sinon.stub(request, 'post', () => { accessory.setStateCallback(undefined, 200, 'body', spy); });

      const value = 17.9;
      accessory.setState(value, spy);

      expect(spy).to.have.been.calledOnce;
      expect(spy.lastCall.args).to.have.length(0);
      request.post.restore();
    });

    it('should call the callback function with error parameter', () => {
      const spy = sinon.spy();
      sinon.stub(request, 'post', () => { accessory.setStateCallback('some error', 200, 'body', spy); });

      const value = 17.9;
      accessory.setState(value, spy);

      expect(spy).to.have.been.calledOnce;
      expect(spy.lastCall.args).to.have.length(1);
      expect(spy).to.have.been.calledWith('some error');
      request.post.restore();
    });
  });
});
