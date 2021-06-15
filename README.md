# PostCSS Tailwindcss At Rules

[PostCSS][PostCSS] plugin for Tailwind CSS At-rules, `@apply-group`.

`@apply-group` works like [@apply][apply] and lets you group by variants.

Basically, you can turn this,

```scss
.btn-toggle {
  @apply bg-red-800 p-2 text-white text-xs mt-4 
    dark:text-gray-800 dark:bg-gray-300 
    sm:text-sm sm:p-4 sm:text-gray-100 
      sm:dark:bg-gray-500 sm:dark:text-white 
    md:text-base md:p-8 md:bg-red-500 md:text-gray-100 
      md:dark:bg-gray-600 md:dark:text-red-100 
    lg:text-lg lg:p-12 lg:bg-red-300 lg:text-gray-700 
      lg:dark:bg-gray-700 lg:dark:text-red-100 
    xl:text-2xl xl:p-16 xl:bg-white xl:text-gray-800 
      xl:dark:bg-gray-800 xl:dark:text-red-100
}
```

into this.
```scss
.btn-toggle {
  @apply-group bg-red-800 p-2 text-white text-xs mt-4
    dark:(text-gray-800 bg-gray-300)
    sm:(
      text-sm p-4 text-gray-100
      dark:(bg-gray-500 text-white)
    )
    md:(
      text-base p-8
      bg-red-500 text-gray-100
      dark:(bg-gray-600 text-red-100)
    )
    lg:(
      text-lg p-12
      bg-red-300 text-gray-700
      dark:(bg-gray-700 text-red-100)
    )
    xl:(
      text-2xl p-16
      bg-white text-gray-800
      dark:(bg-gray-800 text-red-100)
    );
}
```


## Usage

**Step 1:** Install plugin:

```sh
npm install --save-dev postcss @downwindcss/postcss-tailwindcss-at-rules
```

**Step 2:** Check you project for existed PostCSS config: `postcss.config.js`
in the project root, `"postcss"` section in `package.json`
or `postcss` in bundle config.

If you do not use PostCSS, add it according to [official docs]
and set this plugin in settings.

**Step 3:** Add the plugin to plugins list:

```diff
module.exports = {
  plugins: {
+   "@downwindcss/postcss-tailwindcss-at-rules": {},
    tailwindcss: {},
    autoprefixer: {}
  }
};

```

**Step 4:** Replace `@apply` with `@apply-group` in your Tailwind CSS file.  
(The file with `@tailwind base/utilities/components` directives).

For more info on `@apply`, refer to the official Tailwind CSS [documentation][apply].

## Demo

- **video**: https://imgur.com/a/X14w1ud
- **sandbox**: https://codesandbox.io/s/postcss-plugin-for-tailwind-css-apply-group-105nm
- **source**: https://github.com/downwindcss/postcss-tailwindcss-at-rules
- **npm**: https://www.npmjs.com/package/@downwindcss/postcss-tailwindcss-at-rules

## Limitiations

1. This is an alpha library!  
    No tooling support (no indentation, highlighting, etc)  
    No tests, no error handling, etc.  
    Use it at your own risk.
    
2. This works only for your main tailwind css file only!  
(The one with `@tailwind base/utilities/components` directives).  

3. Doesn't iterate over DOM elements, parsing class list, etc...  
  (I might create a JavaScript library extracting the text parsing code first...  
  There are other libraries that does something similar but mostly for CSS-in-JS)

4. This is written using an old PostCSS syntax thus not as performant.  
  (I have no idea how to write it in PostCSS v8 syntax as I am writing this plugin as I go along learning PostCSS...)

## Misc.

Group syntax, `variant:(...)`, is based off of [twin.macro][twin.macro].  

---

[official docs]: https://github.com/postcss/postcss#usage
[PostCSS]: https://github.com/postcss/postcss
[apply]: https://tailwindcss.com/docs/functions-and-directives#apply
[twin.macro]: https://github.com/ben-rogerson/twin.macro