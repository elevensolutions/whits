import type {AttributesArg, ChildrenArg, SelectorString, SelectorName, TagContent, TagChild} from './types.js';
import {RawContent} from './raw.js';
import {Tag} from './tag/tag.js';

export * from './raw.js';
export * from './tag/tag.js';
export * from './utils.js';

/**
 * Returns a "factory" function to create tags with the given selector.
 * @param selectorString The selector string of the tag.
 * @returns A function to create tags with the given selector.
 */
export function _<S extends SelectorString, T extends SelectorName<S> = SelectorName<S>>(selectorString: S) {
	/**
	 * Creates a new `Tag` instance with the given selector and content.
	 * @param tag The tag name or selector.
	 * @param content The children or content of the tag.
	 * @returns A new `Tag` instance.
	 */
	function createTag(content?: ChildrenArg<T>): Tag<S, T>;
	/**
	 * Creates a new `Tag` instance with the given selector, attributes, and content.
	 * @param tag The tag name or selector.
	 * @param attributes The attributes of the tag.
	 * @param content The children or content of the tag.
	 * @returns A new `Tag` instance.
	 */
	function createTag(attributes?: AttributesArg<T>, content?: ChildrenArg<T>): Tag<S, T>;
	function createTag(arg2?: AttributesArg<T> | ChildrenArg<T>, content?: ChildrenArg<T>): Tag<S, T> {
		if (typeof arg2 === 'string' || arg2 instanceof RawContent || Array.isArray(arg2)) return new Tag(selectorString, {}, arg2 as ChildrenArg<T>);
		return new Tag(selectorString, arg2 as AttributesArg<T>, content);
	}
	return createTag;
}

/**
 * Marks the given string as raw content by wrapping it in a `RawContent` instance.
 * This interprets the string as raw HTML content and prevents it from being escaped.
 * @param content The raw content.
 * @returns A new `RawContent` instance.
 */
export function raw(content: string): RawContent {
	return new RawContent(content);
}

/**
 * Creates a `doctype` tag.
 * @returns A new `RawContent` instance.
 */
export function doctype(): RawContent {
	return raw('<!DOCTYPE html>\n');
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
	return _('script')(raw(String.raw({ raw: content }, ...values)));
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
	return _('style')(raw(String.raw({ raw: content }, ...values)));
}

/**
 * Loops over the given number of iterations and calls the given callback function for each iteration.
 * @param count The number of iterations.
 * @param callback The callback function.
 * @returns An array of the return values of the callback function.
 */
export function loop(count: number, callback: (index: number) => TagChild): TagContent {
	return Array.from({length: count}, ($$, i) => callback(i));
}
