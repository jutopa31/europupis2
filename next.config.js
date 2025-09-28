const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure Next.js resolves deps from this project, not parent workspaces
  outputFileTracingRoot: path.join(__dirname),
};

module.exports = nextConfig;
