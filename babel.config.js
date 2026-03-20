/**
 * Babel plugin: replace import.meta.env.X → process.env.X
 * Fixes zustand devtools using import.meta.env in non-module web bundles.
 */
function importMetaEnvPlugin() {
  return {
    visitor: {
      MetaProperty(path) {
        // import.meta.env.MODE → process.env.NODE_ENV
        const { parent } = path;
        if (parent.type === 'MemberExpression' && parent.property.name === 'env') {
          const grandParent = path.parentPath.parent;
          if (
            grandParent &&
            grandParent.type === 'MemberExpression' &&
            grandParent.property.name === 'MODE'
          ) {
            // import.meta.env.MODE → process.env.NODE_ENV
            path.parentPath.parentPath.replaceWithSourceString('process.env.NODE_ENV');
          } else {
            // import.meta.env → process.env
            path.parentPath.replaceWithSourceString('process.env');
          }
        }
      },
    },
  };
}

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      importMetaEnvPlugin,
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
