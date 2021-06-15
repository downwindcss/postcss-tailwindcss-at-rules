const postcss = require('postcss');
const XRegExp = require('xregexp');

function hasAtRule(css, atRule, condition) {
	let found = false;

	css.walkAtRules(
		atRule,
		condition === undefined
			? () => {
					found = true;
					return false;
				}
			: (node) => {
					if (condition(node)) {
						found = true;
						return false;
					}
				}
	);

	return found;
}

const newline = /\r?\n|\r|\t/gim;
// https://stackoverflow.com/a/449000/4035
const start = '(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)+:\\(';
const end = '\\)';
const flags = 'gimu';
const valueNames = [ 'between', 'variant', 'inside-variant' ];

const matcher = (text) =>
	XRegExp.matchRecursive(text.replace(newline, ' '), start, end, flags, {
		valueNames
	});

// variant with ":"
function build(text, result = [], variant = '') {
	const matches = matcher(text);
	if (variant === '' && matches.length === 1) {
		result.push(matches[0].value);
		return;
	}

	let currentVariant = variant;
	matches.map(({ name, value }) => {
		if (name === 'between') {
			// chain variants (e.g. sm:dark:hover:bg-black)
			result.push(...value.split(' ').filter(Boolean).map((utility) => `${variant}${utility}`));
		} else if (name === 'variant') {
			// remove '(' from 'md:('
			currentVariant = currentVariant + value.substring(0, value.length - 1);
		} else if (name === 'inside-variant') {
			build(value, result, currentVariant);
			// restore variant
			currentVariant = variant;
		}
	});
}

function processCSS(css) {
	css.walkAtRules('apply-group', (atRule) => {
		const built = [];
		atRule.name = 'apply';
		build(atRule.params, built);
		atRule.params = built.join(' ');
	});
}

function variantGroupsPlugin(css) {
	if (!hasAtRule(css, 'apply-group')) {
		return css;
	}

	return postcss([ processCSS ]).process(css, { from: __filename });
}

module.exports = postcss.plugin('variantGroups', () => {
	return postcss([ variantGroupsPlugin ]).process();
});

// module.exports = (opts = { }) => {

//   // Work with options here

//   return {
//     postcssPlugin: 'postcss-tailwindcss-at-rules',
//     /*
//     Root (root, postcss) {
//       // Transform CSS AST here
//     }
//     */

//     /*
//     Declaration (decl, postcss) {
//       // The faster way to find Declaration node
//     }
//     */

//     /*
//     Declaration: {
//       color: (decl, postcss) {
//         // The fastest way find Declaration node if you know property name
//       }
//     }
//     */
//   }
// }
module.exports.postcss = true;
