import type {Attributes, AttributesArg, Selector, SelectorName, TagContent} from './types';
import {RawContent} from './raw';
import {encodeEntities} from './utils';

class TagClass {
	private readonly value: Set<string> = new Set();

	constructor(value?: string | Set<string> | string[]) {
		if (!value) return;
		typeof value === 'string' ? this.add(value) : this.add(...value);
	}

	public add(...value: string[]): void {
		for (const item of value) this.value.add(item);
	}

	public remove(...value: string[]): void {
		for (const item of value) this.value.delete(item);
	}

	public clear(): void {
		this.value.clear();
	}

	public toString(): string {
		return Array.from(this.value).join(' ');
	}
}

class TagStyle {
	private readonly value: Map<string, string> = new Map();

	constructor(value?: string | Record<string, string> | Map<string, string>) {
		if (!value) return;
		if (typeof value === 'string') {
			for (const rule of value.split(';')) for (let [name, style] of rule.split(':')) {
				if (name?.trim()) this.value.set(name, style.trim());
			}
		} else {
			for (const [key, style] of (value instanceof Map ? value : Object.entries(value))) {
				this.value.set(key.trim(), style.trim());
			}
		}
	}

	public toString(): string {
		return Array.from(this.value).map(([key, style]) => `${key}: ${style};`).join(' ');
	}
}

export class Tag<S extends Selector, T extends SelectorName<S> = SelectorName<S>> {
	public readonly tag: T;
	public readonly children: TagContent;
	public readonly attributes: Partial<Attributes<T>> = {};

	public class: TagClass = new TagClass();
	public style: TagStyle = new TagStyle();

	constructor(
		public readonly selector: S,
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

	public clone(deep: boolean = false): Tag<S, T> {
		return new Tag(this.selector, this.attributes, deep ? this.children.map((child) => {
			if (child instanceof Tag || child instanceof RawContent) return child.clone();
			return child.toString();
		}) : undefined);
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
		return `<${this.tag}${this.htmlAttributes}>${this.htmlChildren}</${this.tag}>`;
	}
}
