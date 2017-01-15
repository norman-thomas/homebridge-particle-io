require('should');
const sinon = require('sinon');

const plugin = require('../src/index.js');
const ParticlePlatform = require('../src/Platform.js');

describe('index.js', () => {
  describe('index.js', () => {
    it('should be a function', () => {
      plugin.should.be.a.function;
    });

    it('should initialize properly', () => {
      const spy = sinon.spy();
      const homebridge = { registerPlatform: spy };
      plugin(homebridge);
      spy.calledWith('homebridge-particle-io', 'ParticleIO', ParticlePlatform).should.be.true;
    });

    it('platform should expose homebridge globally', () => {
      const homebridge = { registerPlatform: () => {} };
      plugin(homebridge);
      global.homebridge.should.be.equal(homebridge);
    });
  });
});
