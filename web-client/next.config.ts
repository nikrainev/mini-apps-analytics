import type { NextConfig } from 'next';
require('dotenv').config();

const { i18n } = require('./next-i18next.config');

const publicRuntimeConfig = {
    appEnv: process.env.APP_ENV
};


const nextConfig: NextConfig = {
    publicRuntimeConfig,
    i18n,
};

export default nextConfig;
