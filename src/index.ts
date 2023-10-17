import {HTMLAttribute, HTMLTag} from './htmlAttributes.js';

type SelectorPart = '' | `.${string}` | `#${string}`;
type Selector = {[K in HTMLTag]: `${K}${SelectorPart}`}[HTMLTag] | SelectorPart;
type SelectorName<S extends Selector> = S extends `${infer T}${SelectorPart}` ? T extends '' ? 'div' : T & HTMLTag : never;

type Attributes<T extends HTMLTag> = {[K in keyof RawAttrs<T>]: (K extends keyof ParsedAttrs ? RawAttrs<T> | ParsedAttrs : RawAttrs<T>)[K]}
type RawAttrs<T extends HTMLTag> = Record<HTMLAttribute<T> | `data-${string}`, string | boolean>;
type TagContent = (AnyTag | RawContent | string)[];
type AnyTag = {[K in Selector]: Tag<K>}[Selector];

interface ParsedAttrs {
	class: Record<string, string>;
	style: Record<string, string>;
}

export function encodeEntities(input: string): string {
	return input.
		replace(/&/g, '&amp;').
		replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, function(value: string) {
			return '&#' + (((value.charCodeAt(0) - 0xD800) * 0x400) + (value.charCodeAt(1) - 0xDC00) + 0x10000) + ';';
		}).
		replace(/([^\#-~ |!])/g, function(value: string) {
			return '&#' + value.charCodeAt(0) + ';';
		}).
		replace(/</g, '&lt;').
		replace(/>/g, '&gt;');
}

export class RawContent {
	private readonly __RAW: true = true;
	constructor(public content: string) {}
}

export class Tag<S extends Selector, T extends SelectorName<S> = SelectorName<S>> {
	public readonly tag: T = this.selector.replace(/[\.#].*$/, '').replace(/^$/, 'div') as T;
	public readonly rawContent: TagContent;

	constructor(
		public readonly selector: S,
		public readonly attributes: Partial<Attributes<T>> = {},
		rawContent?: TagContent | RawContent | string
	) {
		this.rawContent = rawContent ? (Array.isArray(rawContent) ? rawContent : [rawContent]) : [];
	}

	public get htmlAttributes(): string {
		const attributes = Object.entries(this.attributes).filter(([, value]) => typeof value !== 'boolean' || value === true).map(([key, value]) => {
			if (typeof value === 'boolean') return key;
			return `${key}="${encodeEntities(value as string)}"`;
		}).join(' ');
		return attributes ? ` ${attributes}` : '';
	}

	public get htmlChildren(): string {
		return this.rawContent.map((child) => {
			if (child instanceof Tag) return child.html;
			if (child instanceof RawContent) return child.content;
			return encodeEntities(child);
		}).join('');
	}

	public get html(): string {
		return `<${this.tag}${this.htmlAttributes}>${this.htmlChildren}</${this.tag}>`;
	}
}

export function _<S extends Selector, T extends SelectorName<S>>(tag: S, attributes?: Partial<Attributes<T>>, content?: TagContent | RawContent | string): Tag<S, T> {
	return new Tag(tag, attributes, content);
}

export function raw(content: string): RawContent {
	return new RawContent(content);
}
