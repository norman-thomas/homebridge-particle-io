const ParticlePlatform = require('./platform.js');

module.exports = (homebridge) => {
  global.homebridge = homebridge;
  homebridge.registerPlatform('homebridge-particle', 'Particle', ParticlePlatform);
};
