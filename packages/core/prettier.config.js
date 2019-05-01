module.exports = {
  trailingComma: 'all',
  singleQuote: true,
  endOfLine: 'lf',
  overrides: [
    {
      files: '*.html',
      options: {
        printWidth: 100,
      },
    },
    {
      files: '*.scss',
      options: {
        singleQuote: false,
      },
    },
  ],
};
