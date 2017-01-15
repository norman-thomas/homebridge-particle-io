const dummyConfig = {
  platform: 'ParticleIO',
  name: 'Particle Devices',
  access_token: '<<access token>>',
  cloud_url: 'https://api.particle.io/v1/devices/',
  devices: [
    {
      name: 'Bedroom Light',
      type: 'lightbulb',
      device_id: 'abcdef1234567890',
      function_name: 'onoff',
      args: '0={STATE}'
    },
    {
      name: 'Kitchen Light',
      type: 'lightbulb',
      device_id: '1234567890abcdef',
      function_name: 'onoff',
      args: '1={STATE}'
    },
    {
      name: 'Kitchen Temperature',
      type: 'temperaturesensor',
      device_id: '1234567890abcdef',
      event_name: 'temperature'
    },
    {
      name: 'Kitchen Humidity',
      type: 'humiditysensor',
      device_id: '1234567890abcdef',
      event_name: 'humidity'
    }
  ]
};

module.exports = dummyConfig;
