/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Netlify specific settings
  images: {
    unoptimized: true, // This helps with Netlify deployment
  },
  
  // Additional settings for production
  poweredByHeader: false, // Remove X-Powered-By header for security
}

module.exports = nextConfig 