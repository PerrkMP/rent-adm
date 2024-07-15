const webpack = require('webpack');

module.exports = function override(config) {
    config.resolve.fallback = {
        util: require.resolve('util/'),
        stream: require.resolve('stream-browserify'),
        assert: require.resolve('assert/'),
        crypto: require.resolve('crypto-browserify'),
    };

    config.plugins.push(
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],
        }),
    );

    return config;
};
