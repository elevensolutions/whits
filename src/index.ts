import type {HtmlTagName} from './htmlAttributes.js';
import type {SvgTagName} from './svgAttributes.js';
import type {ArtificialTag} from './tag/tag.js';
import {TagFactory, tagFactory} from './tag/factory.js';
import {htmlTags} from './tag/htmlTags.js';
import {svgTags} from './tag/svgTags.js';

export * from './raw.js';
export * from './utils.js';
export * from './template.js';
export * from './templateTags.js';

export * from './htmlAttributes.js';
export * from './svgAttributes.js';

/**
 * The main interface that contains factories for all HTML and SVG tags.
 * Can be called as a function to create a tag with the given selector,
 * or can be used as a namespace to access the factories of all tags.
 */
export const $
	: typeof tagFactory & {[K in HtmlTagName]: TagFactory<[K]>} & {[K in SvgTagName]: TagFactory<[K]>}
	= Object.assign(tagFactory, svgTags, htmlTags);

/**
 * Extends the `$` object with new HTML and/or SVG tags.
 * Define the new tag types in the `HtmlAttributeOverrides` or `SvgAttributeOverrides` interface first.
 * @param tags The tags to add.
 * @example
 * import {extend} from 'whits';
 * declare module 'whits' {
 *   interface HtmlAttributeOverrides {
 *     foo: 'bar' | 'baz';
 *     boo: 'far' | 'faz';
 *   }
 * }
 * extend('foo', 'boo');
 */
export function extend<T extends readonly ArtificialTag[]>(...tags: ArtificialTag extends T[number] ? T : never): typeof $ {
	for (const tag of tags) if (!$[tag]) Object.assign($, {[tag]: $(tag)});
	return $;
}
