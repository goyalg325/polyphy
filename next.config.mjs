import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
    },
    webpack: (config, { isServer }) => {
        // Add a rule to handle video files
        config.module.rules.push({
            test: /\.(mp4|webm|ogg|swf|ogv)$/,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        publicPath: '/_next/static/videos/',
                        outputPath: 'static/videos/',
                        name: '[name].[ext]',
                    },
                },
            ],
        });

        return config;
    },
};

export default nextConfig;
