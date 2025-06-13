import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	/* config options here */
	allowedDevOrigins: [
		'http://localhost:3000',
		'https://localhost:3000',
		'http://192.168.0.38:3000',
		'http://192.168.0.31:3000',
		'https://192.168.0.31:3000',
		'http://192.168.0.22:3000',
		'https://192.168.0.22:3000',
		'http://192.168.0.38:3000',
		'http://192.168.0.38:3000',
		'http://192.168.0.31:3000',
		'http://192.168.0.31:3000',
		'https://192.168.0.31:3000',
		'https://192.168.0.31:3000',
	],
};

export default nextConfig;
