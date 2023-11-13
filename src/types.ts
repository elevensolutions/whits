import type {GlobalAttribute, HTMLAttribute, HTMLTag} from './htmlAttributes.js';
import type {RawContent} from './raw.js';
import type {Tag} from './tag/tag.js';
import type voids from './tag/voids.js';

/**
 * A string that represents a part of a CSS selector.
 * It can be an empty string, a class selector (starting with a dot), or an ID selector (starting with a hash).
 */
type SelectorPart = '' | `.${string}` | `#${string}`;

/**
 * A type that represents any HTML tag.
 * It is a mapped type that iterates over all possible HTML tag names and returns the corresponding Tag type.
 */
export type AnyTag = {[K in SelectorString]: Tag<K>}[SelectorString];

/**
 * A string that represents the name of a void HTML tag.
 * It is a union of all void HTML tag names.
 */
export type VoidTagName = typeof voids[number];

/**
 * A string that represents the name of a non-void HTML tag.
 * It is a union of all HTML tag names except for void tags.
 */
export type NonVoidTagName = Exclude<HTMLTag, VoidTagName>;

/**
 * A string that represents a CSS selector.
 */
export type SelectorString = {[K in HTMLTag]: `${K}${SelectorPart}`}[HTMLTag] | SelectorPart;

/**
 * A string that represents the name of a tag based on its selector.
 * @template S The selector.
 */
export type SelectorName<S extends SelectorString> = S extends `${infer T}${SelectorPart}` ? T extends '' ? 'div' : T & HTMLTag : never;

/**
 * Represents a child of a tag.
 */
export type TagChild = AnyTag | RawContent | string;

/**
 * Represents a function that creates a child of a tag.
 */
export type TagChildFactory = (...args: any[]) => TagChild;

/**
 * An array of `Tag`, `RawContent`, or string values that represent the content or children of a tag.
 */
export type TagContent = TagChild[];

/**
 * An object that represents the attributes of an HTML tag.
 * It is a record type that maps attribute names to their values.
 * @template T The HTML tag name.
 */
export type Attributes<T extends HTMLTag> = Record<HTMLAttribute<T> | `data-${string}` | GlobalAttribute, string | boolean>;

/**
 * Represents an object that can be used to specify attributes for an HTML element.
 * @template T The HTML tag name.
 */
export type AttributesArg<T extends HTMLTag> = Partial<Attributes<T> | {
	class: string[] | Set<string>;
	style: Record<string, string> | Map<string, string>;
}>;

/**
 * Represents an object that can be used to specify children for an HTML element.
 * @template T The HTML tag name.
 */
export type ChildrenArg<T extends HTMLTag> = T extends VoidTagName ? undefined : (TagChild | TagChildFactory)[] | TagChildFactory | RawContent | string;
