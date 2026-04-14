module.exports = {
  extends: ["stylelint-config-standard"],
  ignoreFiles: ["dist/**", "node_modules/**"],
  rules: {
    "custom-property-pattern": "^ca-[a-z0-9-]+$",
    "declaration-no-important": true,
    "selector-class-pattern": "^[a-z][a-z0-9-]*$",
  },
  overrides: [
    {
      files: ["src/styles.css"],
      rules: {
        // styles.css currently includes both token definitions and global usage.
        "value-keyword-case": null,
        "custom-property-empty-line-before": null,
        "color-function-alias-notation": null,
        "color-function-notation": null,
        "alpha-value-notation": null,
        "declaration-property-value-keyword-no-deprecated": null,
        "media-feature-range-notation": null,
        "declaration-no-important": null,
        "color-no-hex": null,
        "unit-disallowed-list": null,
        "declaration-property-value-disallowed-list": null,
      },
    },
    {
      files: [
        "src/app/**/*.css",
        "src/features/**/*.css",
        "src/pages/**/*.css",
        "src/shared/**/*.css",
      ],
      rules: {
        // Enforce tokenized values in component/feature-level stylesheets.
        "color-no-hex": true,
        "unit-disallowed-list": ["px", "rem", "em", "ms", "s"],
        "declaration-property-value-disallowed-list": {
          "/^(color|background|background-color|border-color|outline-color|box-shadow|text-shadow|fill|stroke)$/":
            [
              "/^(?!(.*var\\(|inherit$|initial$|unset$|transparent$|currentColor$|none$)).+/",
            ],
        },
      },
    },
  ],
};
