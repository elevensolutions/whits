import type {HTMLTag} from '../htmlAttributes.js';
import type {SVGTag} from '../svgAttributes.js';
import type {Tag} from './tag.js';
import {TagClass} from './class.js';
import voids from './voids.js';

/**
 * A string that represents a part of a CSS selector.
 * It can be an empty string, a class selector (starting with a dot), or an ID selector (starting with a hash).
 */
export type SelectorPart = '' | `.${string}` | `#${string}`;

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
 * Represents a CSS-type selector.
 * It can be a tag name, an ID selector, a class selector, or a combination of those.
 * @template S The selector string.
 * @template T The tag name.
 * @example new Selector('div#id.class1.class2');
 */
export class Selector<S extends SelectorString, T extends SelectorName<S> = SelectorName<S>> {
	/** The tag name of the selector. */
	public readonly tag: T;

	/** The ID of the selector. */
	public id?: string;

	/** The class of the tag. */
	public class: TagClass = new TagClass();

	/**
	 * Creates a new Selector instance.
	 * @param selector The selector string to parse.
	 */
	constructor(selector: S = '' as S) {
		const parts = [...(selector.replace(/\s+/g, '').matchAll(/(?<mod>[\.#])?(?<name>[\w_-]*)/g))].filter((part) => part.groups?.name);
		this.tag = (parts.find((part) => !part.groups?.mod)?.groups?.name || '') as T;
		this.id = parts.find((part) => part.groups?.mod === '#')?.groups?.name;

		for (const part of parts) {
			if (part.groups?.mod === '.') this.class.add(part.groups.name as string);
		}
	}

	/**
	 * Returns the string representation of the selector.
	 * @returns The string representation of the selector.
	 */
	public toString(): SelectorString {
		let str: SelectorString = this.tag || '';
		if (this.id) str += `#${this.id}`;
		str += this.class.toSelector();
		return str as SelectorString;
	}
}
