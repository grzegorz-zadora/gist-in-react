// @ts-check

/**
 * @type {import("eslint").ESLint.ConfigData}
 */
module.exports = {
  extends: ["gist-in-react"],
  overrides: [
    {
      files: [
        "./app/**/page.tsx",
        "./app/**/layout.tsx",
        "./app/**/loading.tsx",
        "./app/**/template.tsx",
        "./app/**/not-found.tsx",
        "./app/**/global-error.tsx",
        "./app/**/route.tsx",
        "./app/**/error.tsx",
      ],
      rules: {
        "import/no-default-export": "off",
      },
    },
  ],
};
