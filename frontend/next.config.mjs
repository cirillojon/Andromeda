/** @type {import('next').NextConfig} */
let remote_url = process.env.REMOTE_URL ?? "http://167.71.165.9";

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
        source: "/api/user/:sso_token",
        destination: `${remote_url}/api/user/:sso_token`,
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
      },
      {
        source: "/api/project/user/:user_id",
        destination: `${remote_url}/api/project/user/:user_id`,
      },
      {
        source: "/api/project/:project_id",
        destination: `${remote_url}/api/project/:project_id`,
      },
      {
        source: "/api/financing_option",
        destination: `${remote_url}/api/financing_option`,
      },
      {
        source: "/api/financing_option/:option_id",
        destination: `${remote_url}/api/financing_option/:option_id`,
      },
      {
        source: "/api/financing_detail",
        destination: `${remote_url}/api/financing_detail`,
      },
      {
        source: "/api/financing_detail/project/:project_id",
        destination: `${remote_url}/api/financing_detail/project/:project_id`,
      },
      {
        source: "/api/installer",
        destination: `${remote_url}/api/installer`,
      },
      {
        source: "/api/installer/:installer_id",
        destination: `${remote_url}/api/installer/:installer_id`,
      },
      {
        source: "/api/waitlist",
        destination: `${remote_url}/api/waitlist`,
      },
      {
        source: "/api/waitlist/:waitlist_id",
        destination: `${remote_url}/api/waitlist/:waitlist_id`,
      },
      {
        source: "/api/project_step",
        destination: `${remote_url}/api/project_step`,
      },
      {
        source: "/api/project_step/:step_id",
        destination: `${remote_url}/api/project_step/:step_id`,
      }
    ];
  },
};

export default nextConfig;