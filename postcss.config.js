
'use strict';

/**
 * packages
 *
 * - postcss-cssnext
 *   - autoprefixer
 * - postcss-smart-import
 *   - postcss-import
 *   - postcss-url
 *   - postcss-assets
 */

const devConfig = (webpack) => {
  return {
    plugins: [
      require('postcss-for'),
      require('postcss-advanced-variables'),
      require('postcss-smart-import')({ addDependencyTo: webpack }),
      require('postcss-mixins'),
      require('postcss-random'),
      require('postcss-cssnext'),
      require('postcss-reporter'),
      require('postcss-browser-reporter')
    ]
  };
};

const prodConfig = (webpack) => {
  return {
    plugins: [
      require('postcss-for'),
      require('postcss-advanced-variables'),
      require('postcss-smart-import')({ addDependencyTo: webpack }),
      require('postcss-mixins'),
      require('postcss-random'),
      require('postcss-cssnext')
    ]
  };
};

module.exports = process.env.NODE_ENV !== 'production' ? devConfig : prodConfig;
