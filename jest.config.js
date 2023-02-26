module.exports = {
  transform: {
    '\\.[jt]sx?$': 'babel-jest',
  },
  testPathIgnorePatterns: ['<rootDir>/.history'],
}
