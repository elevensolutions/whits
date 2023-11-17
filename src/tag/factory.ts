import type {AttributesArg, ChildrenArg, SelectorName, SelectorString, TagFactory} from '../types.js';
import {RawContent} from '../raw.js';
import {Tag} from './tag.js';

/**
 * Returns a "factory" function to create tags with the given selector.
 * @param selectorString The selector string of the tag.
 * @returns A function to create tags with the given selector.
 */
export function tagFactory<S extends SelectorString, T extends SelectorName<S> = SelectorName<S>>(selectorString: S): TagFactory<S, T> {
	return function createTag(arg2?: AttributesArg<T> | ChildrenArg<T>, content?: ChildrenArg<T>): Tag<S, T> {
		if (typeof arg2 === 'string' || arg2 instanceof RawContent || Array.isArray(arg2)) return new Tag(selectorString, {}, arg2 as ChildrenArg<T>);
		return new Tag(selectorString, arg2 as AttributesArg<T>, content);
	}
}
