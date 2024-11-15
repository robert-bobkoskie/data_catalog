const { overrideDevServer } = require('customize-cra');

module.exports = {
  webpack: function(config, env) {
    return config;
  },
  devServer: function(configFunction) {
    return function(proxy, allowedHost) {
      const config = configFunction(proxy, allowedHost);

      config.setupMiddlewares = (middlewares, devServer) => {
        if (!devServer) {
          throw new Error('webpack-dev-server is not defined');
        }

        // Custom middlewares
        devServer.app.get('/some/api', function (req, res) {
          res.json({ custom: 'response' });
        });

        return middlewares;
      };

      // Add allowedHosts to the configuration
      config.allowedHosts = ['localhost'];

      return config;
    };
  },
};
