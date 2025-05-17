/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow tiny PNG flag sprites from FlagCDN
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
        pathname: '/w40/**'   // only the 40-px versions
      }
    ]
  }
};

module.exports = nextConfig;
