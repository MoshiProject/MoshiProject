/**
 * @type {import("@types/eslint").Linter.BaseConfig}
 */
module.exports = {
  extends: [
    'plugin:hydrogen/recommended',
    'plugin:hydrogen/typescript',
    'prettier',
  ],
  plugins: ['prettier'],
  rules: {'prettier/prettier': ['error', {endOfLine: 'auto'}]},
};
