// Tests run as native ES modules (see the "test" script in package.json).
export default {
  testMatch: ["<rootDir>/tests/**/*.test.js"],
  // Builds the site once into .test-build/ before any test runs
  globalSetup: "<rootDir>/tests/setup/build-site.js",
  transform: {},
};
