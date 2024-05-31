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
        source: "/api/user/:sso_token",
        destination: "http://167.71.165.9/api/user/:sso_token",
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
      },
      {
        source: "/api/project/:project_id",
        destination: "http://167.71.165.9/api/project/:project_id",
      },
      {
        source: "/api/financing_option",
        destination: "http://167.71.165.9/api/financing_option",
      },
      {
        source: "/api/financing_option/:option_id",
        destination: "http://167.71.165.9/api/financing_option/:option_id",
      },
      {
        source: "/api/financing_detail",
        destination: "http://167.71.165.9/api/financing_detail",
      },
      {
        source: "/api/financing_detail/:detail_id",
        destination: "http://167.71.165.9/api/financing_detail/:detail_id",
      },
      {
        source: "/api/installer",
        destination: "http://167.71.165.9/api/installer",
      },
      {
        source: "/api/installer/:installer_id",
        destination: "http://167.71.165.9/api/installer/:installer_id",
      },
      {
        source: "/api/project_step",
        destination: "http://167.71.165.9/api/project_step",
      },
      {
        source: "/api/project_step/:step_id",
        destination: "http://167.71.165.9/api/project_step/:step_id",
      }
    ];
  },
};

export default nextConfig;
