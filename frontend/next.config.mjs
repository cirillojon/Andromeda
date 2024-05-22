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
        destination: "http://backend:5000/api/hello",
      },
    ];
  },
};

export default nextConfig;
