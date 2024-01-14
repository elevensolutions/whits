# `whits` - Write HTML in TypeScript

<!-- Badges -->
[![build & test](https://img.shields.io/github/actions/workflow/status/elevensolutions/whits/build.yml?label=build%20%26%20test&logo=githubactions&logoColor=white&labelColor=333)](https://github.com/elevensolutions/whits/actions/workflows/build.yml)
[![docs](https://img.shields.io/github/actions/workflow/status/elevensolutions/whits/docs.yml?label=docs&logo=githubactions&logoColor=white&labelColor=333)](https://github.com/elevensolutions/whits/actions/workflows/docs.yml)
[![coverage](https://img.shields.io/endpoint?url=https%3A%2F%2Fgist.githubusercontent.com%2Felevenadmin%2Fa1557037f77868d0594ea5e610d9c3b7%2Fraw%2Fbadge.json&labelColor=333)](https://github.com/elevensolutions/whits/actions/workflows/build.yml)
[![github](https://img.shields.io/github/package-json/v/elevensolutions/whits/main?logo=github&labelColor=333&label)](https://github.com/elevensolutions/whits)
[![npm](https://img.shields.io/npm/v/whits?logo=npm&labelColor=333&label)](https://www.npmjs.com/package/whits)
[![api docs](https://img.shields.io/badge/api_docs-blue?logo=typescript&labelColor=333)](https://elevensolutions.github.io/whits/)

`whits` is a Node.js library that generates HTML code programmatically with all the advantages of TypeScript, such as 
type-checking, autocompletion, decorators, etc. It provides a clean and concise way to create dynamic HTML templates, 
with types that provide safeguards against generating invalid HTML.

## Contents
- [`whits` - Write HTML in TypeScript](#whits---write-html-in-typescript)
	- [Contents](#contents)
	- [Installation](#installation)
	- [Basic Usage](#basic-usage)
		- [Import `$`](#import-)
		- [Creating tags](#creating-tags)
		- [Nesting](#nesting)
		- [Strings and raw content](#strings-and-raw-content)
		- [Whitespace](#whitespace)
	- [Creating full HTML templates](#creating-full-html-templates)
	- [Generating static HTML](#generating-static-html)
		- [Using the CLI](#using-the-cli)
	- [Using custom tags and attributes](#using-custom-tags-and-attributes)
		- [Extending `whits`](#extending-whits)
		- [A note about importing the extension module](#a-note-about-importing-the-extension-module)
	- [Special thanks](#special-thanks)
	- [Contributing](#contributing)
	- [License](#license)
	- [Future enhancements](#future-enhancements)

## Installation
```
npm i whits
```

## Basic Usage

### Import `$`
To use `whits` in your TypeScript project, you can import the `$` object.
```typescript
import {$} from 'whits';
```

### Creating tags
There are many ways to build out your HTML. The shortest, if the tag doesn't have an ID or class, is to use the 
properties of the `$` object, which correspond to all the valid HTML tags. You can also call `$` as a function and 
pass a selector to create tags with `class` and/or `id` attributes. There is no "best" way, except what is most 
readable and convenient for you!

```typescript
// Many ways of creating equivalent divs
const divs = [

	// Use the individual tag factory, and pass the attribues as an object in the first argument
	// Pass the content as the second argument
	$.div({id: 'example', class: ['foo', 'bar']}, 'Hello, world!'),

	// Create a factory by passing a CSS-style selector to the `$` function
	// Then pass attributes as an object in the first argument, and content as the second argument
	$('div')({id: 'example', class: ['foo', 'bar']}, 'Hello, world!'),
	$('div#example')({class: ['foo', 'bar']}, 'Hello, world!'),

	// If there are no attributes to add, pass the content as the first argument
	$('div#example.foo.bar')('Hello, world!'),

	// If there is no tag name passed to the `$` function, it will default to `div`
	$('#example.foo.bar')('Hello, world!'),
	$('#example')({class: ['foo', 'bar']}, 'Hello, world!'),
	$('')({id: 'example', class: ['foo', 'bar']}, 'Hello, world!'),

];

// Each tag has an `html` getter that returns a string representation of the tag
// All of the examples above will have the same HTML output
console.log(
	divs.every((example) => example.html === '<div class="foo bar" id="example">Hello, world!</div>')
);
// Output: true
```

### Nesting
One of the essential capabilities is nesting of tags. This works in an intuitive way, just like in HTML.

```typescript
// Children are passed to the factory in an array, after the attributes object if there is one
$.div([
	$.h1('Example'),
	$.p('Hello, world!')
]);
$.div({'data-foo': 'bar'}, [
	$.h1('Example'),
	$.p('Hello, world!')
]);

// Children can be a mix of tags, raw content (more on this later), and strings
$.div([
	$.h1('Example'),
	'Hello, world!',
	$.p('This is a paragraph.')
]);

// A single string or raw content doesn't need to go in an array
$.div('Hello, world!');
$.div(raw('<p>Hello, world!</p>'));

// If a child is an empty or void tag, the factory function itself can be passed without being called
$.div([
	$.div,             // Empty div
	$.br,              // Void tag <br>
	$('i.fa.fa-star')  // Empty tag with classes passed as a selector
])

// Nesting can go as deep as you need it to
$.main([
	$('#container')([
		$.section({'data-foo': 'bar'}, [
			$.h1('Example'),
			$.div([
				$.p(['Hello,', $.b('world'), '!']),
			])
		])
	])
]);
```

### Strings and raw content
By default, strings are escaped automatically. You can import and use the `raw`, `comment`, `css`, and `javascript` 
template literal functions to pass unescaped content as children into a tag.

> &#9888; Use caution when calling these functions, as they are unfiltered and can be unsafe and error-prone.

\
`raw()` - Insert raw, unescaped HTML content.
```typescript
import {$, raw} from 'whits';

// Use as a template literal tag
$.div(
	// This string is escaped automatically
	'Hello, <world>!',

	// But this one is not
	raw`
		<div>
			<p>Raw HTML</p>
		</div>
	`
);

// Use as a standard function
$.div(raw('<p>Raw HTML</p>'));
```

\
`comment()` - Insert an HTML comment
```typescript
import {$, comment} from 'whits';

// Use as a template literal tag or a standard function
$.div(comment`This is a comment`);
$.div(comment('This is a comment'));
```

\
`javascript()` - Insert raw javascript, automatically wrapped in a `script` tag.
> &#9432; The [`es6-string-javascript`](https://marketplace.visualstudio.com/items?itemName=zjcompt.es6-string-javascript) 
> VSCode extension can be used to get syntax highlighting within the template literal.
```typescript
import {$, javascript} from 'whits';

// Must be used as a template literal tag
$.head([
	javascript`
		const message = 'Hello, world!';
		console.log(message);
	`
]);
```

\
`css()` - Insert raw CSS, automatically wrapped in a `style` tag.
> &#9432; The [`es6-string-html`](https://marketplace.visualstudio.com/items?itemName=Tobermory.es6-string-html) 
> VSCode extension can be used to get syntax highlighting within the template literal.
```typescript
import {$, css} from 'whits';

// Must be used as a template literal tag
$.head([
	css`
		body {
			background-color: #000;
			color: #fff;
		}
	`
]);
```

### Whitespace
Whitespace in strings is not automatically truncated. However, there is no space rendered between HTML tags.
Therefore, if you want space in your output, you should add it manually via strings.
```typescript
// Add a full empty line between tags
$.div([
	$.h1('Hello, world!'),
	'\n\n',
	$.p('This is a paragraph.')
]);
```

## Creating full HTML templates
You can create HTML template files by exporting instances of the `Template` and `RootTemplate` classes, which include 
methods for rendering the content as a string. The `Template` constructor allows passing the template content as a 
Tag instance, raw content, a string, or an array of any of these. Alternatively, you can pass a function that returns 
the content in any of those formats. The function accepts a `params` object which you can use to pass variables from 
your application code.

See the [basic code example](https://github.com/elevensolutions/whits/tree/main/examples/basic) for details.

## Generating static HTML
Generating static HTML files is also a simple process, which comes down to 3 steps:
1. Name the files you want to compile `*.html.ts`. The compiler will ignore other files.
2. Set the default export of the template files. It can be any of the following:
   ```typescript
   // RootTemplate.render() output, passing a predefined params object
   export default (new RootTemplate<{foo: string}>(({foo}) => [$.div(foo)])).render({foo: 'bar'});

   // A RootTemplate instance, receiving the params object from the command line
   export default new RootTemplate<{foo: string}>(({foo}) => [$.div(foo)]);

   // A RootTemplate instance with no params
   export default new RootTemplate([$.div('bar')]);

   // Any other string or instance of Template, RootTemplate, or RawContent is acceptable
   export default 'This string will be escaped.';
   export default raw('<template>This is an HTML <b>template</b> partial.</template>');
   ```
3. Run the `whits` cli, passing the input/output directories and (optional) params object as arguments.

See the [static code example](https://github.com/elevensolutions/whits/tree/main/examples/static) for details.

### Using the CLI
The CLI is useful for generating static HTML from your templates. It can generate from your TypeScript source or the 
compiled JavaScript if you've already run `tsc` or similar.
```
Usage: whits [-w] [-e <extend>] <input> <output> [...params]
  -w     - watch for changes
  -e     - extend whits with a module that adds new tags
  extend - path to a module that extends whits, relative to the input directory
  input  - path to the input directory
  output - path to the output directory
  params - JSON-formatted object of params to pass to the templates
```

```bash
# Build from compiled JS files, assuming they are in `dist` dir, output HTML to `html` dir
npx whits dist html

# Build and watch source TS files, assuming they are in `src` dir, output HTML to `out` dir
# Intermediate JS files will go into a `.whits-dist` dir, which can be deleted after
npx whits -w src out

# Assuming there is a `tsconfig.json` file, build according to that and output HTML to `out` dir
# Built JS files will go into the `outDir` specified in `tsconfig.json`
npx whits . out

# Same as previous example, but pass an object to the templates
npx whits . out '{"foo": "bar"}'

# Same as previous example, but also extend whits with a module called `baz`
npx whits -e baz . out '{"foo": "bar"}'
```

> &#9432; **Known issue:** _The `-w` feature is not perfect. It mostly works, but it may not behave as expected when adding or deleting files._

## Using custom tags and attributes
In keeping with its inherent strictness, `whits` forces you to use valid HTML5 tags and attributes. You may find,
however, that your project requires using non-standard tags or attributes. A quick workaround would obviously be to 
wrap raw HTML strings in calls to the `raw()` function. While this works for one-off tags here and there, doing it 
excessively defeats the purpose of a strongly-typed templating system. This is where `extend()` comes in.

### Extending `whits`
It's super easy. One small file in your project can give you practically unlimited flexibility. You can call it 
whatever you want, but we'll use `extend-me.ts` for this example. Say you want to be able to add these elements:
```html
<foo bar="baz" far="faz">foo</foo>
<boo id="boo">boo</boo>
<div invalid-prop="val">hello</div>
```

This is all you need:
```typescript
// extend-me.ts

import {extend} from 'whits';

// Use an ambient module to modify the `whits` types
declare module 'whits' {

	// Override the tag => attribute mapping
	interface HtmlAttributeOverrides {
		foo: 'bar' | 'far';   // Add a `foo` tag with `bar` and `far` attributes
		boo: undefined;       // Add a `boo` tag with only the global attributes
		div: 'invalid-attr';  // Add `invalid-attr` as an attribute to div tags
	}
}

// Call the extend function, passing only the new tags
// If you are only adding attributes to existing tags, you can skip this part
// This call technically doesn't have to be in the same file as the ambient module
extend('foo', 'boo');
```
```typescript
// a-template.ts

import {$, Template} from 'whits';

// Make sure you import the extension module
import './extend-me.js'

// Export your template
export default new Template([
	$.foo({bar: 'baz', far: 'faz'}, 'foo'),
	$('boo#boo')('boo'),
	$.div({'invalid-attr': 'val'}, 'hello')
]);
```

You can also add custom SVG tags and attributes, which works the same way.
See the [extend code example](https://github.com/elevensolutions/whits/tree/main/examples/extend) for details.

### A note about importing the extension module
Since we are extending the global instance of `whits` we only really need to import the module once per entrypoint. If 
it has already been imported somewhere else in the app, `import {$} from 'whits'` will re-import the already modified 
instance. This means that if you are serving dynamic pages from a `node` app, you can import the module in your app 
init process and skip importing it into any of your template files.

If, however, you are building a static site, each `*.html.ts` file is essentially its own entrypoint. There are two 
options for this case:
1. Import the module in each template where you need to use the custom tags.
2. Use the `-e` command-line argument to specify a module (relative to the input path) to import globally:
   ```bash
   # This will import `src/extend-me.ts` globally
   npx whits -e extend-me src html

   # Also works to import the equivalent JS module if generating from pre-compiled code
   # This will import `dist/extend-me.js` globally
   npx whits -e extend-me dist html
   ```

## Special thanks
A quick shout out to a few other folks:
- [wooorm](https://github.com/wooorm/), for his amazingly useful tag name and attribute lists, 
  which he has unwittingly provided as the basis for the type definitions in this project
- The [Pug](https://pugjs.org/) team, for lots of inspiration
- [GitHub Copilot](https://github.com/features/copilot), for drastically cutting down the 
  development time for this project
- You, for your support! ❤️

## Contributing
Contributions to `whits` are welcome! To contribute, please fork the repository and submit a pull request.

## License
`whits` is licensed under the MPL-2.0 License. See [LICENSE](LICENSE) for more information.

## Future enhancements
- Advanced usage documentation
