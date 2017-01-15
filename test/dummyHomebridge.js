const Service = require('hap-nodejs').Service;
const Characteristic = require('hap-nodejs').Characteristic;

const dummyHomebridge = (config) => {
  const homebridge = {
    hap: {
      Service,
      Characteristic
    },

    registerPlatform: (pluginName, accessoryName, constructor) => {
      this.platform = new constructor(() => {}, config);
    }
  };
  return homebridge;
};

module.exports = dummyHomebridge;
