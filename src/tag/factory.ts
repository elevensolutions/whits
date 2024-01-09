import type {SelectorName, SelectorString} from './selector.js';
import {RawContent} from '../raw.js';
import {AttributesArg, ChildrenArg, Tag} from './tag.js';

/**
 * A factory function that creates a new instance of a tag.
 * @template S - The selector.
 * @template T - The tag name.
 */
export interface TagFactory<S extends SelectorString, T extends SelectorName<S> = SelectorName<S>> {
	/**
	 * Creates a new `Tag` instance with the given content.
	 * @param content The children or content of the tag.
	 * @returns A new `Tag` instance.
	 */
	(content: ChildrenArg<T>): Tag<S, T>;

	/**
	 * Creates a new `Tag` instance with the given attributes and content.
	 * @param attributes The attributes of the tag.
	 * @param content The children or content of the tag.
	 * @returns A new `Tag` instance.
	 */
	(attributes?: AttributesArg<T>, content?: ChildrenArg<T>): Tag<S, T>;
}

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
