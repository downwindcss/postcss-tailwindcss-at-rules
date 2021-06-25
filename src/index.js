const postcss = require('postcss');
const { parse } = require('@downwindcss/variant-group');

// From Tailwind CSS source code,
// https://github.com/tailwindlabs/tailwindcss/blob/55653ba0041cf2806f236f00c59307b12f757385/src/lib/substituteClassApplyAtRules.js#L14-L30
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

function processCSS(css) {
	css.walkAtRules('apply-group', (atRule) => {
		// const built = [];
		atRule.name = 'apply';
		atRule.params = parse(atRule.params).join(' ');
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

module.exports.postcss = true;
