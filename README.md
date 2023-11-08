# HTTS - HyperText TypeScript

HTTS is a Node.js library that generates HTML code programmatically with all the advantages of TypeScript, such as 
type-checking, autocompletion, decorators, etc. It provides a clean and concise way to create dynamic HTML templates, 
with types that provide safeguards against generating invalid HTML.

## Installation
```
npm install htts
```

## Basic Usage
To use HTTS in your TypeScript project, you can use the convenience functions to build out a template:
```typescript
// templates/index.ts

import {_, html, raw} from 'htts';

export default html({}, [
	_('head', [
		_('title', 'Something')
	]),
	_('body.bodyClass', {}, [
		_('#containerId.containerClass', [
			_('h1', 'Hello world!'),
			_('p', 'This is a paragraph'),
			raw('<!-- Here is a comment, interpreted as raw HTML -->'),
		])
	])
]);
```

Then, import the template elsewhere in your project:
```typescript
import indexTemplate from 'templates/index.ts';

function exampleDumpToStdout(): void {
	console.log(indexTemplate.html);
}
```

This will output the following HTML code:
```html
<head>
	<title>Something</title>
</head>
<body class="bodyClass">
	<div id="containerId" class="containerClass">
		<h1>Hello world!</h1>
		<p>This is a paragraph</p>
		<!-- Here is a comment, interpreted as raw HTML -->
	</div>
</body>
```

## Contributing
Contributions to HTTS are welcome! To contribute, please fork the repository and submit a pull request.

## License
HTTS is licensed under the MPL-2.0 License. See [LICENSE](LICENSE) for more information.
