// https://docs.expo.dev/guides/using-eslint/
import stylistic from '@stylistic/eslint-plugin';
import expoConfig from 'eslint-config-expo/flat.js';
import { defineConfig } from 'eslint/config';

export default defineConfig([
	expoConfig,
	{
		ignores: ['dist/*', 'app-example/*'],
	},
	{
		plugins: {
			"@stylistic": stylistic,
		},
		rules: {
			"camelcase": ["error", {
				properties: "never",
			}],
			"no-console": ["error", {
				allow: ["error"],
			}],
			"prefer-const": ["error"],
			"func-names": ["error", "always"],
			"curly": ["error", "all"],
			"require-await": ["error"],
			"no-else-return": ["error"],
			"@stylistic/brace-style": ["error"],
			"@stylistic/comma-dangle": ["error", "always-multiline"],
			"@stylistic/object-curly-spacing": ["error", "always"],
			"@stylistic/array-bracket-spacing": ["error", "never"],
			"@stylistic/quote-props": ["error", "consistent-as-needed"],
			"@stylistic/multiline-comment-style": ["error", "starred-block"],
			"@stylistic/semi": ["error", "always"],
		},
	},
]);
