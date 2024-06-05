import type {HtmlTagName, AnyHtmlTag, HtmlAttributes, ArtificialHtmlTag} from '../htmlAttributes.js';
import type {SvgTagName, AnySvgTag, SvgAttributes, ArtificialSvgTag} from '../svgAttributes.js';
import type {SelectorName, SelectorString, VoidTagName} from './selector.js';
import type {CompoundTag} from './compoundTag.js';
import {Selector} from './selector.js';
import {RawContent} from '../raw.js';
import {encodeEntities} from '../utils.js';
import {TagClass} from './class.js';
import {TagStyle} from './style.js';
import voids from './voids.js';

/**
 * A type that represents any tag that is user-defined.
 */
export type ArtificialTag = ArtificialHtmlTag | ArtificialSvgTag;

/**
 * Represents a child of a tag.
 */
export type TagChild<T extends HtmlTagName | SvgTagName> = (T extends HtmlTagName ? AnyHtmlTag | Tag<SvgTagName, 'svg'> | CompoundTag<any[], HtmlTagName> : AnySvgTag | CompoundTag<any[], SvgTagName>) | RawContent | string | null | false | undefined;

/**
 * Represents a function that creates a child of a tag.
 */
export type TagChildFactory<T extends HtmlTagName | SvgTagName> = (...args: any[]) => TagChild<T>;

/**
 * An array of `Tag`, `RawContent`, or string values that represent the content or children of a tag.
 */
export type TagContent<T extends HtmlTagName | SvgTagName> = TagChild<T>[];

/**
 * An object that represents the attributes of a tag.
 * It is a record type that maps attribute names to their values.
 * @template T The tag name.
 */
export type Attributes<T extends HtmlTagName | SvgTagName> = T extends HtmlTagName ? HtmlAttributes<T> : T extends SvgTagName ? SvgAttributes<T> : never;

/**
 * Represents an object that can be used to specify attributes for an HTML or SVG element.
 * @template T The tag name.
 */
export type AttributesArg<T extends HtmlTagName | SvgTagName> = Partial<Attributes<T> | {
	class: string[] | Set<string>;
	style: Record<string, string> | Map<string, string>;
}>;

/**
 * Represents an object that can be used to specify children for an HTML element.
 * @template T The HTML tag name.
 */
export type HtmlChildrenArg<T extends HtmlTagName> = T extends VoidTagName ? undefined : (TagChild<HtmlTagName> | TagChildFactory<HtmlTagName>)[] | TagChild<HtmlTagName> | TagChildFactory<HtmlTagName> | RawContent | string;

/**
 * Represents an object that can be used to specify children for an SVG element.
 * @template T The SVG tag name.
 */
export type SvgChildrenArg = (TagChild<SvgTagName> | TagChildFactory<SvgTagName>)[] | TagChild<SvgTagName> | TagChildFactory<SvgTagName> | RawContent | string;

/**
 * Represents an object that can be used to specify children for an HTML or SVG element.
 */
export type ChildrenArg<T extends HtmlTagName | SvgTagName> = T extends HtmlTagName ? HtmlChildrenArg<T> : SvgChildrenArg;


/**
 * Represents an HTML tag with its attributes and children.
 * @template S The selector.
 * @template T The tag name.
 */
export class Tag<S extends SelectorString, T extends SelectorName<S> = SelectorName<S>> {
	/** The list of tags that are immune from whitespace truncation */
	public static readonly keepWhitespace: Set<HtmlTagName | SvgTagName> = new Set(['pre', 'textarea']);

	/** The selector of the tag. */
	public readonly selector: Selector<S, T>;
	
	/** Whether the tag is a void tag or not. */
	public readonly isVoid: T extends VoidTagName ? true : false;
	
	/** An array of child elements of the tag. */
	public readonly children: T extends VoidTagName ? [] : TagContent<T>;
	
	/** The attributes of the tag. */
	public readonly attributes: Partial<Attributes<T>> = {};
	
	/** Optional content to insert before and/or after the tag. */
	public readonly outerContent: Record<'before' | 'after', null | string | RawContent> = {before: null, after: null};

	/** The style of the tag. */
	public style: TagStyle = new TagStyle();

	/**
	 * Creates a new instance of the `Tag` class.
	 * @param selectorString The selector string of the tag.
	 * @param attributes The attributes of the tag.
	 * @param children An array of child elements of the tag.
	 */
	constructor(
		selectorString: S = 'div' as S,
		attributes: AttributesArg<T> = {},
		children?: ChildrenArg<T>
	) {
		this.selector = new Selector<S, T>(selectorString);
		this.isVoid = voids.includes(this.tag as VoidTagName) as any;
		this.children = (children && !this.isVoid ? (Array.isArray(children) ? children : [children]) : [] as any)
			.map((child) => typeof child === 'function' ? child() : child)
			.filter((child) => child);

		if (this.isVoid) {
			Object.freeze(this.children);
			if (children) throw new Error(`Void tag ${this.tag} cannot have children`);
		}

		Object.defineProperties(this.attributes, {
			class: {
				configurable: false, enumerable: true,
				set: (v) => this.selector.class = new TagClass(v),
				get: () => this.selector.class.toString()
			},
			style: {
				configurable: false, enumerable: true,
				set: (v) => this.style = new TagStyle(v),
				get: () => this.style.toString()
			},
			id: {
				configurable: false, enumerable: true,
				set: (v) => this.selector.id = v,
				get: () => this.selector.id
			}
		});

		Object.assign(this.attributes, attributes);
	}

	/**
	 * Returns the content to insert before or after the tag.
	 * @param section The section to retrieve - before or after.
	 * @returns The content of the specified section, or an empty string if it does not exist.
	 */
	private getOuter(section: keyof Tag<S>['outerContent']): string {
		const value = this.outerContent[section];
		if (!value) return '';
		if (value instanceof RawContent) return value.content;
		return encodeEntities(value, true);
	}

	/**
	 * Clones the tag.
	 * @param deep Whether to clone the children of the tag or not.
	 * @returns A new instance of the `Tag` class.
	 */
	public clone(deep: boolean = false): Tag<S, T> {
		const attributes = JSON.parse(JSON.stringify(this.attributes));
		if (this.isVoid || !deep) return new Tag(this.selector.toString(), attributes);
		return new Tag(
			this.selector.toString(), attributes,
			this.children.map((child) => {
				if (child instanceof Tag || child instanceof RawContent) return child.clone(true);
				return child.toString();
			}) as ChildrenArg<T>
		);
	}

	/**
	 * Returns the HTML string representation of the tag.
	 * @returns The HTML string representation of the tag.
	 */
	public toString(): string {
		return this.html;
	}

	/**
	 * The class of the tag.
	 */
	public set class(value: TagClass) {
		this.selector.class = value;
	}
	public get class(): TagClass {
		return this.selector.class;
	}

	/**
	 * Returns the tag name.
	 * @returns The tag name.
	 */
	public get tag(): T {
		return this.selector.tag || 'div';
	}

	/**
	 * Returns the HTML attributes string of the tag.
	 * @returns The HTML attributes string of the tag.
	 */
	public get htmlAttributes(): string {
		const attributes = Object.entries(this.attributes).filter(([, value]) => value).map(([key, value]) => {
			if (typeof value === 'boolean') return key;
			return `${key}="${encodeEntities(value as string)}"`;
		}).join(' ');
		return attributes ? ` ${attributes}` : '';
	}

	/**
	 * Returns the HTML string representation of the child elements of the tag.
	 * @returns The HTML string representation of the child elements of the tag.
	 */
	public get htmlChildren(): string {
		return this.children.map((child) => {
			if (child instanceof Tag || (child as CompoundTag<any>).constructor?.name === 'CompoundTag') return child.html;
			if (child instanceof RawContent) return child.toString();
			return encodeEntities(child, !Tag.keepWhitespace.has(this.tag));
		}).join('');
	}

	/**
	 * Returns the HTML string representation of the tag.
	 * @returns The HTML string representation of the tag.
	 */
	public get html(): string {
		const before = this.getOuter('before');
		const after = this.getOuter('after');
		const htmlOpen = `${before}<${this.tag}${this.htmlAttributes}>`;
		if (this.isVoid) return htmlOpen + after;
		return `${htmlOpen}${this.htmlChildren}</${this.tag}>${after}`;
	}
}
