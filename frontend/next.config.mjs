/** @type {import('next').NextConfig} */
// Set below to "http://nginx:80" for local development
let remote_url = "http://167.71.165.9";
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
        destination: `${remote_url}/api/hello`,
      },
      {
        source: "/api/user",
        destination: `${remote_url}/api/user`,
      },
      {
        source: "/api/user/:user_id",
        destination: `${remote_url}/api/user/:user_id`,
      },
      {
        source: "/api/form",
        destination: `${remote_url}/api/form`,
      },
      {
        source: "/api/form/:form_id",
        destination: `${remote_url}/api/form/:form_id`,
      },
      {
        source: "/api/forms/user/:user_id",
        destination: `${remote_url}/api/forms/user/:user_id`,
      },
      {
        source: "/api/form_data",
        destination: `${remote_url}/api/form_data`,
      },
      {
        source: "/api/form_data/:form_id",
        destination: `${remote_url}/api/form_data/:form_id`,
      }
    ];
  },
};

export default nextConfig;
