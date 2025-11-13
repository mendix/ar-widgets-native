const base = require("@mendix/pluggable-widgets-tools/configs/eslint.ts.base.json");

module.exports = {
    ignorePatterns: [
        "**/bundle/**",
        "**/babylonjscore.js",
        "**/babylonjscore.amd.js"
    ],
    ...base
};
