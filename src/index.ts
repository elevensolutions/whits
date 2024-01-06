import {tagFactory} from './tag/factory.js';
import {htmlTags} from './tag/htmlTags.js';
import {svgTags} from './tag/svgTags.js';

export * from './tag/tag.js';
export * from './raw.js';
export * from './utils.js';
export * from './template.js';
export * from './templateTags.js';

/**
 * The main interface that contains factories for all HTML and SVG tags.
 * Can be called as a function to create a tag with the given selector,
 * or can be used as a namespace to access the factories of all tags.
 */
export const $: typeof tagFactory & typeof htmlTags & typeof svgTags = Object.assign(tagFactory, svgTags, htmlTags);
