module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'], // Use only this if using Expo
    plugins: [
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
          blacklist: null,
          whitelist: null,
          safe: false,
          allowUndefined: true,
        },
      ],
    ],
  };
};
