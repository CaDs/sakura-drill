const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);
// Metro 0.81.x doesn't recognise this key; remove it to suppress the validation warning.
delete config.watcher?.unstable_workerThreads;
module.exports = config;
