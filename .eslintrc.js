module.exports = {
  extends: ['airbnb', 'plugin:prettier/recommended'],
  plugins: ['react', 'jsx-a11y', 'import', 'react-hooks'],
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      presets: ['@babel/preset-react'],
    },
  },
  ignorePatterns: ["!.*", "dist", "node_modules"],
  rules: {
    'prettier/prettier': 'error',
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/button-has-type': 'off',
    'react/prop-types': 'off',
    'import/no-named-as-default': 'off',
    'import/no-named-as-default-member': 'off',
    'jsx-a11y/label-has-associated-control': 'off',
    'no-console': 'off',
  },
  env: {
    browser: true,
  },
};
