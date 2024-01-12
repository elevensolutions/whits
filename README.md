# `whits` - Write HTML in TypeScript

[![build & test](https://img.shields.io/github/actions/workflow/status/elevensolutions/whits/build.yml?style=flat&label=build%20%26%20test&logo=github)](https://github.com/elevensolutions/whits/actions/workflows/build.yml)
[![docs](https://img.shields.io/github/actions/workflow/status/elevensolutions/whits/docs.yml?style=flat&label=docs&logo=github)](https://github.com/elevensolutions/whits/actions/workflows/docs.yml)
[![coverage](https://img.shields.io/endpoint?url=https%3A%2F%2Fgist.githubusercontent.com%2Felevenadmin%2Fa1557037f77868d0594ea5e610d9c3b7%2Fraw%2Fbadge.json)](https://github.com/elevensolutions/whits/actions/workflows/build.yml)

`whits` is a Node.js library that generates HTML code programmatically with all the advantages of TypeScript, such as 
type-checking, autocompletion, decorators, etc. It provides a clean and concise way to create dynamic HTML templates, 
with types that provide safeguards against generating invalid HTML.

## Installation
```
npm install whits
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

	// If there are no attributes beyond what is in the selector, pass the content as the first argument
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

// If a child element is empty or a void tag, the factory function itself can be passed without being called
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
```typescript
import {$, comment, css, javascript, raw} from 'whits';

// Use the `raw` function to insert raw, unescaped HTML content, either as a template tag or a function call
// This should be used sparingly, as it can be unsafe and error-prone
$.div(
	'Hello, <world>!', // String is escaped automatically
	raw`
		<div>
			<p>Raw HTML</p>
		</div>
	`
);
$.div(raw('<p>Raw HTML</p>'));

// Use the `comment` function to insert an HTML comment, either as a template tag or a function call
$.div(comment`This is a comment`);
$.div(comment('This is a comment'));

// Use the `javascript` template tag to insert raw JavaScript code into a new `script` tag
// The `es6-string-javascript` VSCode extension can be used to get syntax highlighting for the JavaScript code
$.head([
	javascript`
		const message = 'Hello, world!';
		console.log(message);
	`
]);

// Use the `css` template tag to insert raw CSS code into a new `style` tag
// The `es6-string-html` VSCode extension can be used to get syntax highlighting for the CSS code
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

See the [basic code example](examples/src/basic/) for details.

## Generating static HTML
Generating static HTML files is also a simple process, which comes down to 4 steps:
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
3. Compile TS => JS (using `tsc` or similar)
4. Run the `whits` cli, passing the input/output directories and (optional) params object as arguments:
   ```bash
   # The input should be your dist dir, where your compiled JS files are
   # npx whits <input> <output> [params]
   npx whits dist html '{"foo": "bar"}'
   ```
See the [static code example](examples/src/static/) for details.

## Using custom tags and attributes
In keeping with its inherent strictness, `whits` forces you to use valid HTML5 tags and attributes. You may find,
however, that your project requires using non-standard tags or attributes. A quick workaround would obviously be to 
wrap raw HTML strings in calls to the `raw()` function. While this works for one-off tags here and there, doing it 
excessively defeats the purpose of a strongly-typed templating system. This is where `extend()` comes in.

### Extending `whits`
It's super easy. One small file in your project can give you practically unlimited flexibility. You can call it 
whatever you want, but we'll use `whits.ts` for this example. Say you want to be able to add these elements:
```html
<foo bar='baz' far='faz'>foo</foo>
<boo id='boo'>boo</boo>
<div invalid-prop='val'>hello</div>
```

This is all you need:
```typescript
// whits.ts

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
import './whits.js'

// Export your template
export default new Template([
	$.foo({bar: 'baz', far: 'faz'}, 'foo'),
	$('boo#boo')('boo'),
	$.div({'invalid-attr': 'val'}, 'hello')
]);
```

You can also add custom SVG tags and attributes, which works the same way.
See the [extend code example](examples/src/extend/) for details.

### A note about importing the extension module
Since we are extending the global instance of `whits` we only really need to import the module once per entrypoint. If 
it has already been imported somewhere else in the app, `import {$} from 'whits'` will re-import the already modified 
instance. This means that if you are serving dynamic pages from a `node` app, you can import the module in your app 
init process and skip importing it into any of your template files.

If, however, you are building a static site, each `*.html.ts` file is essentially its own entrypoint. There are two 
options for this case:
1. Import the module in each template where you need to use the custom tags.
2. Use the `-e` command-line argument to specify a module to import globally:
   ```bash
   npx whits -e dist/whits.js dist html
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
