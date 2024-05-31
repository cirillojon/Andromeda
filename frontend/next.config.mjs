/** @type {import('next').NextConfig} */
const nextConfig = {
  webpackDevMiddleware: config => {
    // Use polling to enable hot reloading in Docker
    config.watchOptions = {
      poll: 1000,  // Check for file changes every 1000 milliseconds (1 second)
      aggregateTimeout: 300,  // Delay re-compiling after the first change for a short time to aggregate any other changes
    };
    return config;
  },
  async rewrites() {
    return [
      {
        source: "/api/hello",
        destination: "http://167.71.165.9/api/hello",
      },
      {
        source: "/api/user",
        destination: "http://167.71.165.9/api/user",
      },
      {
        source: "/api/user/:user_id",
        destination: "http://167.71.165.9/api/user/:user_id",
      },
      {
        source: "/api/form",
        destination: "http://167.71.165.9/api/form",
      },
      {
        source: "/api/form/:form_id",
        destination: "http://167.71.165.9/api/form/:form_id",
      },
      {
        source: "/api/forms/user/:user_id",
        destination: "http://167.71.165.9/api/forms/user/:user_id",
      },
      {
        source: "/api/form_data",
        destination: "http://167.71.165.9/api/form_data",
      },
      {
        source: "/api/form_data/:form_id",
        destination: "http://167.71.165.9/api/form_data/:form_id",
      },
      {
        source: "/api/project/user/:user_id",
        destination: "http://167.71.165.9/api/project/user/:user_id",
      }
    ];
  },
};

export default nextConfig;
