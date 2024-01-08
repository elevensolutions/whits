import {$, comment, javascript, loop, raw, Template} from 'htts';

// Export a dynamic template that implements a callback function, which accepts a params object.
// The params object is typed based on the template's generic type parameter.
export default new Template<{liItems: number, heading: string, divItems: string[]}>(

	// The template returns a `Tag` object, which is created by the `$` function.
	// You can pass a CSS-style selector to the `$` function to create a `Tag` factory.
	// The `Tag` factory is a function that accepts attributes and content and returns a `Tag` object.
	// If no tag name is specified, the default is a `div` tag.
	(params) => $('#container')([

		// The first child of the container is an `h1` tag with the value of the `heading` property.
		// The `$.h1` method is a shortcut for creating `h1` tags. All HTML tags have a corresponding method.
		$.h1(params.heading),

		// The next children are `div.item` elements mapped from the `divItems` property.
		// This simply uses the `Array.map` method to create a mapped array.
		// The mapped array is then passed as separate children by using the spread operator.
		...params.divItems.map((item) => $('.item')(item)),

		// The next child is a `ul` tag with children created by the `loop` function.
		$.ul(
			// The `loop` function calls the specified callback function the specified number of times.
			// In this case, the result is an array of `li` tags with the text 'Item i', where `i` is the index of the item.
			// The number of items here is specified by the `liItems` property.
			loop(params.liItems, (i) => $.li('Item ' + i))
		),

		// Use the following functions with caution, as they can be used to create invalid or insecure HTML.

		// The next child is unescaped HTML, in this case a comment.
		// This is created by using the `raw` tagged template literal function.
		raw`<!-- Raw Comment -->`,

		// An easier way to create a comment is to use the `comment` tagged template literal function.
		// This will wrap the string in an HTML comment.
		comment`Comment`,

		// This is a JavaScript template literal, which creates an inline `script` tag containing the raw content.
		// The `es6-string-javascript` VSCode extension provides syntax highlighting within the template literal.
		javascript`
			var text = 'Hello World';
			document.write(text);
		`
	])
);
