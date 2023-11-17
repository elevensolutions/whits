import {tagFactory} from './tag/factory.js';
import {tags} from './tag/htmlTags.js';

export * from './tag/tag.js';
export * from './raw.js';
export * from './utils.js';
export * from './template.js';
export * from './templateTags.js';

export const $: typeof tagFactory & typeof tags = Object.assign(tagFactory, tags);
