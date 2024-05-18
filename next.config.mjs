/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: "/api/hello",
          destination: "http://localhost:5000/api/hello",
        },
      ];
    },
  };
  
  export default nextConfig;
  