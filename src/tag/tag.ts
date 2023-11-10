import type {Attributes, AttributesArg, ChildrenArg, Selector, SelectorName, TagContent, VoidTagName} from '../types.js';
import {RawContent} from '../raw.js';
import {encodeEntities} from '../utils.js';
import {TagClass} from './class.js';
import {TagStyle} from './style.js';
import voids from './voids.js';

/**
 * Represents an HTML tag with its attributes and children.
 * @template S The selector.
 * @template T The tag name.
 */
export class Tag<S extends Selector, T extends SelectorName<S> = SelectorName<S>> {
	/** The tag name. */
	public readonly tag: T;
	
	/** Whether the tag is a void tag or not. */
	public readonly isVoid: T extends VoidTagName ? true : false;
	
	/** An array of child elements of the tag. */
	public readonly children: T extends VoidTagName ? [] : TagContent;
	
	/** The attributes of the tag. */
	public readonly attributes: Partial<Attributes<T>> = {};
	
	/** Optional content to insert before and/or after the tag. */
	public readonly outerContent: Record<'before' | 'after', null | string | RawContent> = {before: null, after: null};

	/** The class of the tag. */
	public class: TagClass = new TagClass();

	/** The style of the tag. */
	public style: TagStyle = new TagStyle();

	/**
	 * Creates a new instance of the `Tag` class.
	 * @param selector The selector string of the tag.
	 * @param attributes The attributes of the tag.
	 * @param children An array of child elements of the tag.
	 */
	constructor(
		public readonly selector: S = 'div' as S,
		attributes: AttributesArg<T> = {},
		children?: ChildrenArg<T>
	) {
		const selectorParts = [...(this.selector.matchAll(/(?<mod>[\.#])?(?<name>[\w_-]*)/g) || [])].filter((part) => part.groups?.name);
		this.tag = (selectorParts.find((part) => !part.groups?.mod)?.groups?.name || 'div') as T;
		this.isVoid = voids.includes(this.tag as VoidTagName) as any;
		this.children = children && !this.isVoid ? (Array.isArray(children) ? children : [children]) : [] as any;
		if (this.isVoid) {
			Object.freeze(this.children);
			if (children) throw new Error(`Void tag ${this.tag} cannot have children`);
		}

		Object.defineProperties(this.attributes, {
			class: {
				configurable: false, enumerable: true,
				set: (v) => this.class = new TagClass(v),
				get: () => this.class.toString()
			},
			style: {
				configurable: false, enumerable: true,
				set: (v) => this.style = new TagStyle(v),
				get: () => this.style.toString()
			}
		});

		const id = selectorParts.find((part) => part.groups?.mod === '#')?.groups?.name;
		if (id) this.attributes.id = id;
		Object.assign(this.attributes, attributes);
		this.class.add(...selectorParts.filter((part) => part.groups?.mod === '.').map((part) => part.groups?.name as string));
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
		return encodeEntities(value);
	}

	/**
	 * Clones the tag.
	 * @param deep Whether to clone the children of the tag or not.
	 * @returns A new instance of the `Tag` class.
	 */
	public clone(deep: boolean = false): Tag<S, T> {
		const attributes = JSON.parse(JSON.stringify(this.attributes));
		if (this.isVoid || !deep) return new Tag(this.selector, attributes);
		return new Tag(
			this.selector, attributes,
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
			if (child instanceof Tag) return child.html;
			if (child instanceof RawContent) return child.content;
			return encodeEntities(child);
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
