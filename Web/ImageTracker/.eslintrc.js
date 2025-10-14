const defaultConfig = require("@mendix/pluggable-widgets-tools/configs/eslint.ts.base.json");

module.exports = {
    ...defaultConfig,
    ignorePatterns: [...(defaultConfig.ignorePatterns || []), "src/bundle/**/*"]
};


