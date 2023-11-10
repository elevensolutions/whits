import type {AttributesArg, ChildrenArg, Selector, SelectorName, TagContent} from './types.js';
import {RawContent} from './raw.js';
import {Tag} from './tag/tag.js';

export * from './raw.js';
export * from './tag/tag.js';
export * from './utils.js';

/**
 * Creates a new `Tag` instance with the given tag and content.
 * @param tag The tag name or selector.
 * @param content The children or content of the tag.
 * @returns A new `Tag` instance.
 */
export function _<S extends Selector, T extends SelectorName<S>>(tag: S, content?: ChildrenArg<T>): Tag<S, T>;
/**
 * Creates a new `Tag` instance with the given tag, attributes, and content.
 * @param tag The tag name or selector.
 * @param attributes The attributes of the tag.
 * @param content The children or content of the tag.
 * @returns A new `Tag` instance.
 */
export function _<S extends Selector, T extends SelectorName<S>>(tag: S, attributes?: AttributesArg<T>, content?: ChildrenArg<T>): Tag<S, T>;
export function _<S extends Selector, T extends SelectorName<S>>(tag: S, arg2?: AttributesArg<T> | ChildrenArg<T>, content?: ChildrenArg<T>): Tag<S, T> {
	if (typeof arg2 === 'string' || arg2 instanceof RawContent || Array.isArray(arg2)) return new Tag(tag, {}, arg2 as ChildrenArg<T>);
	return new Tag(tag, arg2 as AttributesArg<T>, content);
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
 * Creates the root `html` tag with the given attributes and content.
 * @param attributes The attributes of the `html` tag.
 * @param content The children or content of the `html` tag.
 * @returns A new Tag instance using the `html` tag.
 */
export function html(attributes?: AttributesArg<'html'>, content?: TagContent | RawContent | string): Tag<'html'> {
	const tag = _('html', attributes, content);
	tag.outerContent.before = raw('<!doctype html>\n');
	return tag;
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
	return _('script', raw(String.raw({ raw: content }, ...values)));
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
	return _('style', raw(String.raw({ raw: content }, ...values)));
}
