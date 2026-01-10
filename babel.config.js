module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            '@components': './src/components',
            '@screens': './src/screens',
            '@services': './src/services',
            '@theme': './src/theme',
            '@utils': './src/utils',
            '@hooks': './src/hooks',
            '@types': './src/types',
            '@data': './data',
          },
        },
      ],
    ],
  };
};
