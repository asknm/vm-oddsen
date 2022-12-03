module.exports = {
	root: true,
	env: {
		es6: true,
		node: true,
	},
	extends: [
		"eslint:recommended",
		"plugin:import/errors",
		"plugin:import/warnings",
		"plugin:import/typescript",
		"google",
		"plugin:@typescript-eslint/recommended",
	],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		project: ["tsconfig.json", "tsconfig.dev.json"],
		sourceType: "module",
	},
	ignorePatterns: [
		"/lib/**/*", // Ignore built files.
	],
	plugins: [
		"@typescript-eslint",
		"import",
	],
	rules: {
		"quotes": "off",
		"import/no-unresolved": 0,
		"@typescript-eslint/no-var-requires": "off",
		"indent": "off",
		"no-tabs": "off",
		"linebreak-style": "off",
		"object-curly-spacing": "off",
		"require-jsdoc": "off",
		"arrow-parens": "off",
		"brace-style": "off",
		"@typescript-eslint/no-unused-vars": "off",
		"max-len": "off",
		"@typescript-eslint/no-explicit-any": "off",
	},
};
