import {SelectorName, SelectorString} from '../types.js';

export class Selector<S extends SelectorString, T extends SelectorName<S> = SelectorName<S>> {
	public readonly tag: T;
	public id?: string;
	public readonly class: Set<string> = new Set();

	constructor(selector: S = '' as S) {
		const parts = [...(selector.replace(/\s+/g, '').matchAll(/(?<mod>[\.#])?(?<name>[\w_-]*)/g) || [])].filter((part) => part.groups?.name);
		this.tag = (parts.find((part) => !part.groups?.mod)?.groups?.name || '') as T;
		this.id = parts.find((part) => part.groups?.mod === '#')?.groups?.name;

		for (const part of parts) {
			if (part.groups?.mod === '.') this.class.add(part.groups.name as string);
		}
	}

	public toString(): SelectorString {
		let str: SelectorString = this.tag || '';
		if (this.id) str += `#${this.id}`;
		if (this.class.size) str += `.${[...this.class].join('.')}`;
		return str as SelectorString;
	}
}
