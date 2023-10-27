// @ts-check

/**
 * @type {import("eslint").ESLint.ConfigData}
 */
module.exports = {
  root: true,
  extends: ["gist-in-react"],
  overrides: [
    {
      files: ["*.d.ts", "./playwright.config.ts", "jest.config.ts"],
      rules: {
        "import/no-default-export": "off",
      },
    },
  ],
};
