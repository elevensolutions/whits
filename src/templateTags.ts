import {HtmlTagName} from './htmlAttributes.js';
import {RawContent} from './raw.js';
import {SvgTagName} from './svgAttributes.js';
import {Tag, TagChild, TagChildFactory} from './tag/tag.js';

/**
 * A template tag that marks the given string as raw content by wrapping it in a `RawContent` instance.
 * This interprets the string as raw HTML content and prevents it from being escaped.
 * Can also be called as a regular function.
 * @param content The raw content.
 * @returns A new `RawContent` instance.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates
 * @example
 * raw`
 *   <div>
 *     <p>Hello, world!</p>
 *   </div>
 * `
 * raw('<div><p>Hello, world!</p></div>')
 */
export function raw(content: TemplateStringsArray | string, ...values: string[]): RawContent {
	return new RawContent(typeof content === 'string' ? content : String.raw({raw: content}, ...values));
}

/**
 * A template tag that formats the given string as an HTML comment and marks it as raw content by wrapping it in a `RawContent` instance.
 * Can also be called as a regular function.
 * @param content The content of the comment.
 * @returns A new `RawContent` instance.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates
 * @example
 * comment`This is a comment.`
 */
export function comment(content: TemplateStringsArray | string, ...values: string[]): RawContent {
	const contentString = typeof content === 'string' ? content : String.raw({raw: content}, ...values);
	return new RawContent(`<!-- ${contentString.replace(/>/g, '')} -->`);
}

/**
 * A template tag that creates a `script` tag with the given content.
 * The content is interpreted as raw JavaScript code and is not escaped.
 * The `es6-string-javascript` VSCode extension can be used to get syntax highlighting for the JavaScript code.
 * @param content The raw JavaScript code.
 * @returns A new Tag instance using the `script` tag.
 * @see https://marketplace.visualstudio.com/items?itemName=zjcompt.es6-string-javascript
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates
 * @example
 * javascript`
 *   const message = 'Hello, world!';
 *   console.log(message);
 * `
 */
export function javascript(content: TemplateStringsArray, ...values: string[]): Tag<'script'> {
	return new Tag('script', {}, raw(content, ...values));
}

/**
 * A template tag that creates a `style` tag with the given content.
 * The content is interpreted as raw CSS code and is not escaped.
 * The `es6-string-html` VSCode extension can be used to get syntax highlighting for the CSS code.
 * @param content The raw CSS code.
 * @returns A new `Tag` instance using the `style` tag.
 * @see https://marketplace.visualstudio.com/items?itemName=Tobermory.es6-string-html
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates
 * @example
 * css`
 *   div {
 *     background: #fff;
 *   }
 * `
 */
export function css(content: TemplateStringsArray, ...values: string[]): Tag<'style'> {
	return new Tag('style', {}, raw(content, ...values));
}

/**
 * A template tag that interpolates the given content and values.
 * This is used to create a new array of content that can be inserted into a `Tag` instance.
 * @param content The template string, allowing for included expression values to be any valid `Tag` children.
 * @returns The interpolated content as an array of valid `Tag` children.
 * @example
 * _`Hello, ${$.div('world')}!` === ['Hello, ', $.div('world'), '!']; // true
 * // HTML output: Hello, <div>world</div>!
 */
export function _<T extends (TagChild<HtmlTagName | SvgTagName> | TagChildFactory<HtmlTagName | SvgTagName> | string)[]>(content: TemplateStringsArray, ...values: T): (T[number] | string)[] {
	const output: (T[number] | string)[] = [];
	for (const [index, item] of content.entries()) {
		if (item) output.push(item);
		if (index < values.length) output.push(values[index]);
	}
	return output;
}
