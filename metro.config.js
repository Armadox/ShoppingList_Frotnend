const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname, { isCSSEnabled: true });

// Fix for @microsoft/signalr in React Native
config.resolver.extraNodeModules = {
  stream: require.resolve("readable-stream"),
};

module.exports = withNativeWind(config, { input: "./global.css" });
