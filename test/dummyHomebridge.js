const Service = require("hap-nodejs").Service;
const Characteristic = require("hap-nodejs").Characteristic;

const dummyHomebridge = {
  hap: {
    Service,
    Characteristic
  }
};

module.exports = dummyHomebridge;
