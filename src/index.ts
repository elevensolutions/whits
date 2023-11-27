import {tagFactory} from './tag/factory.js';
import {htmlTags} from './tag/htmlTags.js';
import {svgTags} from './tag/svgTags.js';

export * from './tag/tag.js';
export * from './raw.js';
export * from './utils.js';
export * from './template.js';
export * from './templateTags.js';

export const $: typeof tagFactory & typeof htmlTags & typeof svgTags = Object.assign(tagFactory, svgTags, htmlTags);
