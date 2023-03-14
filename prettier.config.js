const base = require("@mendix/pluggable-widgets-tools/configs/prettier.base.json");
module.exports = {
    ...base,
    xmlSelfClosingSpace: true,
    xmlWhitespaceSensitivity: "strict",
    plugins: ["@prettier/plugin-xml"],
    overrides: [
        {
            files: "*.xml",
            options: {
                printWidth: 500
            }
        }
    ]
};
