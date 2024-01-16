import type {SelectorName, SelectorString} from './selector.js';
import {RawContent} from '../raw.js';
import {AttributesArg, ChildrenArg, Tag} from './tag.js';
import {CompoundTag, LastSelector} from './compoundTag.js';

type FactoryOutput<S extends SelectorString[], T extends SelectorName<LastSelector<S>>> = S['length'] extends 1 ? Tag<S[0], T> : CompoundTag<S, T>;

/**
 * A factory function that creates a new instance of a tag.
 * @template S - The selector.
 * @template T - The tag name.
 */
export interface TagFactory<S extends SelectorString[], T extends SelectorName<LastSelector<S>> = SelectorName<LastSelector<S>>> {
	/**
	 * Creates a new `Tag` instance with the given content.
	 * @param content The children or content of the tag.
	 * @returns A new `Tag` instance.
	 */
	(content: ChildrenArg<T>): FactoryOutput<S, T>;

	/**
	 * Creates a new `Tag` instance with the given attributes and content.
	 * @param attributes The attributes of the tag.
	 * @param content The children or content of the tag.
	 * @returns A new `Tag` instance.
	 */
	(attributes?: AttributesArg<T>, content?: ChildrenArg<T>): FactoryOutput<S, T>;
}

/**
 * Returns a "factory" function to create tags with the given selector.
 * @param selectorString The selector string of the tag.
 * @returns A function to create tags with the given selector.
 */
export function tagFactory<S extends SelectorString[], T extends SelectorName<S[number]> = SelectorName<LastSelector<S>>>(...selectorString: [...S]): TagFactory<S, T> {
	return function createTag(arg2?: AttributesArg<T> | ChildrenArg<T>, content?: ChildrenArg<T>): FactoryOutput<S, T> {
		const hasAttributes = !(typeof arg2 === 'string' || typeof arg2 === 'function' || arg2 instanceof RawContent || arg2 instanceof Tag || arg2 instanceof CompoundTag || Array.isArray(arg2));

		if (selectorString.length > 1) {
			return hasAttributes ? new CompoundTag(selectorString, arg2 as AttributesArg<T>, content) : new CompoundTag(selectorString, {}, arg2 as ChildrenArg<T>) as any;
		} else {
			return hasAttributes ? new Tag(selectorString[0], arg2 as AttributesArg<T>, content) : new Tag(selectorString[0], {}, arg2 as ChildrenArg<T>) as any;
		}
	}
}
