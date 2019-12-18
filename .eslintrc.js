module.exports = {
  extends: 'airbnb',
  rules: {
    "arrow-parens": ["error", "as-needed"],
    "import/no-extraneous-dependencies": ["error", {"devDependencies": true}],
    "no-plusplus": "off",
  },
  env: {
    browser: true,
    node: true,
  },
};