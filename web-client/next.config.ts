import type { NextConfig } from 'next';
require('dotenv').config();


const nextConfig: NextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
