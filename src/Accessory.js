class Accessory {

  constructor(log, url, accessToken, device, homebridge) {
    this.log = log;
    this.url = url;
    this.accessToken = accessToken;
    this.homebridge = homebridge;

    this.name = device.name;
    this.args = device.args;
    this.deviceId = device.device_id;
    this.fakeSerial = device.device_id.slice(-8).toUpperCase();
    this.type = device.type.toLowerCase();

    const Service = homebridge.hap.Service;
    const Characteristic = homebridge.hap.Characteristic;
    this.informationService = new Service.AccessoryInformation();
    this.informationService
    .setCharacteristic(Characteristic.Manufacturer, 'Particle')
    .setCharacteristic(Characteristic.Model, 'Photon')
    .setCharacteristic(Characteristic.SerialNumber, this.fakeSerial);

    this.services = [];
    this.services.push(this.informationService);
  }

  getServices() {
    return this.services;
  }
}

module.exports = Accessory;
