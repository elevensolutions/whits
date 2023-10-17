import type {AttributesArg, Selector, SelectorName, TagContent} from './types.js';
import {RawContent} from './raw.js';
import {Tag} from './tag.js';

export * from './raw.js';
export * from './tag.js';
export * from './utils.js';

export function _<S extends Selector, T extends SelectorName<S>>(tag: S, attributes?: AttributesArg<T>, content?: TagContent | RawContent | string): Tag<S, T> {
	return new Tag(tag, attributes, content);
}

export function raw(content: string): RawContent {
	return new RawContent(content);
}
