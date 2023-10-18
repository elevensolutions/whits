import type {Attributes, AttributesArg, Selector, SelectorName, TagContent} from '../types.js';
import {RawContent} from '../raw.js';
import {encodeEntities} from '../utils.js';
import {TagClass} from './class.js';
import {TagStyle} from './style.js';
import voids from './voids.js';

export class Tag<S extends Selector, T extends SelectorName<S> = SelectorName<S>> {
	public readonly tag: T;
	public readonly children: TagContent;
	public readonly attributes: Partial<Attributes<T>> = {};
	public readonly outerContent: Record<'before' | 'after', null | string | RawContent> = {before: null, after: null};

	public class: TagClass = new TagClass();
	public style: TagStyle = new TagStyle();

	constructor(
		public readonly selector: S = 'div' as S,
		attributes: AttributesArg<T> = {},
		children?: TagContent | RawContent | string
	) {
		const selectorParts = [...(this.selector.matchAll(/(?<mod>[\.#])?(?<name>[\w_-]*)/g) || [])].filter((part) => part.groups?.name);
		this.tag = (selectorParts.find((part) => !part.groups?.mod)?.groups?.name || 'div') as T;
		this.children = children ? (Array.isArray(children) ? children : [children]) : [];

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

	private getOuter(section: keyof Tag<S>['outerContent']): string {
		const value = this.outerContent[section];
		if (!value) return '';
		if (value instanceof RawContent) return value.content;
		return encodeEntities(value);
	}

	public clone(deep: boolean = false): Tag<S, T> {
		return new Tag(this.selector, JSON.parse(JSON.stringify(this.attributes)), deep ? this.children.map((child) => {
			if (child instanceof Tag || child instanceof RawContent) return child.clone(true);
			return child.toString();
		}) : undefined);
	}

	public toString(): string {
		return this.html;
	}

	public get htmlAttributes(): string {
		const attributes = Object.entries(this.attributes).filter(([, value]) => value).map(([key, value]) => {
			if (typeof value === 'boolean') return key;
			return `${key}="${encodeEntities(value as string)}"`;
		}).join(' ');
		return attributes ? ` ${attributes}` : '';
	}

	public get htmlChildren(): string {
		return this.children.map((child) => {
			if (child instanceof Tag) return child.html;
			if (child instanceof RawContent) return child.content;
			return encodeEntities(child);
		}).join('');
	}

	public get html(): string {
		const before = this.getOuter('before');
		const after = this.getOuter('after');
		const htmlOpen = `${before}<${this.tag}${this.htmlAttributes}>`;
		if (voids.includes(this.tag as any)) return htmlOpen + after;
		return `${htmlOpen}${this.htmlChildren}</${this.tag}>${after}`;
	}
}
