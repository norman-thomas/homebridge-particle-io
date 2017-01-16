require('should');

const dummyConfig = require('./dummyConfig.js');
const dummyHomebridge = require('./dummyHomebridge.js');

const Accessory = require('../src/Accessory.js');


describe('Accessory.js', () => {
  let accessory;
  let Service;
  let Characteristic;

  before(() => {
    const homebridge = dummyHomebridge(dummyConfig);
    const device = dummyConfig.devices[0];
    const dummyURL = 'https://some.random.url.com/';
    const dummyAccessToken = 'MY_top_SECRET_access_TOKEN';

    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    accessory = new Accessory(
      () => {}, dummyURL, dummyAccessToken, device, homebridge, Service.Lightbulb, Characteristic.On
    );
  });

  it('constructor() should assign parameter values to member variables', () => {
    accessory.url.should.be.equal('https://some.random.url.com/');
    accessory.accessToken.should.be.equal('MY_top_SECRET_access_TOKEN');
    accessory.deviceId.should.be.equal('abcdef1234567890');
    accessory.ServiceType.should.be.equal(Service.Lightbulb);
    accessory.CharacteristicType.should.be.equal(Characteristic.On);

    accessory.services.should.have.length(1);
    accessory.services[0].should.be.an.instanceOf(Service.AccessoryInformation);
  });

  it('getServices() should return all services', () => {
    const services = accessory.getServices();
    services.should.have.length(1);
    services[0].should.be.an.instanceOf(Service.AccessoryInformation);
  });
});
