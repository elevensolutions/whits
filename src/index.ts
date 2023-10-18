import type {AttributesArg, Selector, SelectorName, TagContent} from './types.js';
import {RawContent} from './raw.js';
import {Tag} from './tag/tag.js';

export * from './raw.js';
export * from './tag/tag.js';
export * from './utils.js';

export function _<S extends Selector, T extends SelectorName<S>>(tag: S, content?: TagContent | RawContent | string): Tag<S, T>;
export function _<S extends Selector, T extends SelectorName<S>>(tag: S, attributes?: AttributesArg<T>, content?: TagContent | RawContent | string): Tag<S, T>;
export function _<S extends Selector, T extends SelectorName<S>>(tag: S, arg2?: AttributesArg<T> | TagContent | RawContent | string, content?: TagContent | RawContent | string): Tag<S, T> {
	if (typeof arg2 === 'string' || arg2 instanceof RawContent || Array.isArray(arg2)) return new Tag(tag, {}, arg2);
	return new Tag(tag, arg2, content);
}

export function raw(content: string): RawContent {
	return new RawContent(content);
}

export function html(attributes?: AttributesArg<'html'>, content?: TagContent | RawContent | string): Tag<'html'> {
	const tag = _('html', attributes, content);
	tag.outerContent.before = raw('<!doctype html>\n');
	return tag;
}