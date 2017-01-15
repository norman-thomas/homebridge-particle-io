require('should');
const sinon = require('sinon');

const dummyConfig = require('./dummyConfig.js');
const dummyHomebridge = require('./dummyHomebridge.js');

const Platform = require('../src/Platform.js');

global.homebridge = dummyHomebridge;


describe('Platform-test', () => {
  describe('constructor', () => {
    it('should assign config values to member variables', () => {
      const platform = new Platform(() => {}, dummyConfig);
      platform.accessToken.should.be.equal(dummyConfig.access_token);
      platform.url.should.be.equal(dummyConfig.cloud_url);
      platform.devices.length.should.be.equal(dummyConfig.devices.length);
      platform.accessoryFactory.should.not.be.undefined;
    });

    it('should report accessories', () => {
      const platform = new Platform(() => {}, dummyConfig);
      const spy = sinon.spy();
      platform.accessories(spy);
      spy.should.have.been.calledOnce;
    });
  });
});
