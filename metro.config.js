// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add more extensions for Metro to handle
config.resolver.sourceExts = ['jsx', 'js', 'ts', 'tsx', 'json'];

// Set the port explicitly
config.server = {
  port: 19010, // Use a higher port to avoid conflicts
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      // Add CORS headers
      res.setHeader('Access-Control-Allow-Origin', '*');
      return middleware(req, res, next);
    };
  },
};

// Use a watchman workaround for macOS issues
config.watchFolders = [__dirname];

module.exports = config; 