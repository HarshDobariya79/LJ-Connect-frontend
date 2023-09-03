module.exports = {
  extends: ['airbnb', 'plugin:prettier/recommended'],
  plugins: ['react', 'jsx-a11y', 'import', 'react-hooks'],
  rules: {
    'prettier/prettier': 'error',
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'import/no-named-as-default': 'off',
    'import/no-named-as-default-member': 'off',
  },
  env: {
    browser: true,
  },
};
