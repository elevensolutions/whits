import {SelectorName, SelectorString} from '../types.js';

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

	/** The set of classes of the selector. */
	public readonly class: Set<string> = new Set();

	/**
	 * Creates a new Selector instance.
	 * @param selector The selector string to parse.
	 */
	constructor(selector: S = '' as S) {
		const parts = [...(selector.replace(/\s+/g, '').matchAll(/(?<mod>[\.#])?(?<name>[\w_-]*)/g) || [])].filter((part) => part.groups?.name);
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
		if (this.class.size) str += `.${[...this.class].join('.')}`;
		return str as SelectorString;
	}
}
