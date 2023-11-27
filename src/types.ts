import type {HTMLGlobalAttribute, HTMLAttribute, HTMLTag} from './htmlAttributes.js';
import type {SVGGlobalAttribute, SVGAttribute, SVGTag} from './svgAttributes.js';
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
export type AnyHtmlTag = {[K in HtmlSelectorString]: Tag<K>}[HtmlSelectorString];

/**
 * A type that represents any SVG tag.
 * It is a mapped type that iterates over all possible SVG tag names and returns the corresponding Tag type.
 */
export type AnySvgTag = {[K in SvgSelectorString]: Tag<K>}[SvgSelectorString];

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
 * A string that represents a CSS selector for an HTML tag.
 */
export type HtmlSelectorString = {[K in HTMLTag]: `${K}${SelectorPart}`}[HTMLTag] | SelectorPart;

/**
 * A string that represents a CSS selector for an SVG tag.
 */
export type SvgSelectorString = {[K in SVGTag]: `${K}${SelectorPart}`}[SVGTag] | SelectorPart;

/**
 * A string that represents a CSS selector for a void tag.
 */
export type VoidSelectorString = {[K in VoidTagName]: `${K}${SelectorPart}`}[VoidTagName];

/**
 * A string that represents a CSS selector for a non-void tag.
 */
export type NonVoidSelectorString = {[K in NonVoidTagName]: `${K}${SelectorPart}`}[NonVoidTagName] | SelectorPart;

/**
 * A string that represents a CSS selector for an HTML or SVG tag.
 */
export type SelectorString = HtmlSelectorString | SvgSelectorString;

/**
 * A string that represents the name of an HTML tag based on its selector.
 * @template S The selector.
 */
export type HtmlSelectorName<S extends HtmlSelectorString> = S extends `${infer T}${SelectorPart}` ? T extends '' ? 'div' : T & HTMLTag : never;

/**
 * A string that represents the name of an SVG tag based on its selector.
 * @template S The selector.
 */
export type SvgSelectorName<S extends SvgSelectorString> = S extends `${infer T}${SelectorPart}` ? T extends '' ? 'g' : T & SVGTag : never;

/**
 * A string that represents the name of an HTML or SVG tag based on its selector.
 * @template S The selector.
 */
export type SelectorName<S extends SelectorString> = S extends infer SS ? (SS extends HtmlSelectorString ? HtmlSelectorName<SS> : SS extends SvgSelectorString ? SvgSelectorName<SS> : never) : never;

/**
 * Represents a child of a tag.
 */
export type TagChild<T extends HTMLTag | SVGTag> = (T extends HTMLTag ? AnyHtmlTag | Tag<SVGTag, 'svg'> : AnySvgTag) | RawContent | string;

/**
 * Represents a function that creates a child of a tag.
 */
export type TagChildFactory<T extends HTMLTag | SVGTag> = (...args: any[]) => TagChild<T>;

/**
 * An array of `Tag`, `RawContent`, or string values that represent the content or children of a tag.
 */
export type TagContent<T extends HTMLTag | SVGTag> = TagChild<T>[];

/**
 * An object that represents the attributes of an HTML tag.
 * It is a record type that maps attribute names to their values.
 * @template T The HTML tag name.
 */
export type Attributes<T extends HTMLTag> = Record<HTMLAttribute<T> | `data-${string}` | HTMLGlobalAttribute, string | boolean>;

/**
 * An object that represents the attributes of an SVG tag.
 * It is a record type that maps attribute names to their values.
 * @template T The SVG tag name.
 */
export type SvgAttributes<T extends SVGTag> = Record<SVGAttribute<T> | `data-${string}` | SVGGlobalAttribute, string | boolean>;

/**
 * Represents an object that can be used to specify attributes for an HTML or SVG element.
 * @template T The tag name.
 */
export type AttributesArg<T extends HTMLTag | SVGTag> = Partial<(T extends HTMLTag ? Attributes<T> : T extends SVGTag ? SvgAttributes<T> : never) | {
	class: string[] | Set<string>;
	style: Record<string, string> | Map<string, string>;
}>;

/**
 * Represents an object that can be used to specify children for an HTML element.
 * @template T The HTML tag name.
 */
export type HtmlChildrenArg<T extends HTMLTag> = T extends VoidTagName ? undefined : (TagChild<HTMLTag> | TagChildFactory<HTMLTag>)[] | TagChildFactory<HTMLTag> | RawContent | string;

/**
 * Represents an object that can be used to specify children for an SVG element.
 * @template T The SVG tag name.
 */
export type SvgChildrenArg = (TagChild<SVGTag> | TagChildFactory<SVGTag>)[] | TagChildFactory<SVGTag> | RawContent | string;

/**
 * Represents an object that can be used to specify children for an HTML or SVG element.
 */
export type ChildrenArg<T extends HTMLTag | SVGTag> = T extends HTMLTag ? HtmlChildrenArg<T> : SvgChildrenArg;


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
