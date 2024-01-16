import type {SelectorName, SelectorString} from './selector.js';
import {AttributesArg, ChildrenArg, Tag} from './tag.js';

export type LastSelector<S extends SelectorString[]> = S extends [...SelectorString[], infer L] ? L & SelectorString : never;

/**
 * Represents a compound tag that is composed of multiple nested tags.
 * @template S The selectors of the tags.
 */
export class CompoundTag<S extends SelectorString[], FS extends SelectorString = S[0], LS extends SelectorString = LastSelector<S>> {

	/** The tags that compose the compound tag. */
	public readonly tags: {[K in keyof S]: Tag<S[K]>} = [] as any;

	/** The outermost tag of the compound tag. */
	public readonly outerTag: Tag<FS>;

	/** The innermost tag of the compound tag. */
	public readonly innerTag: Tag<LS>;

	/**
	 * Creates a new compound tag.
	 * @param selectors The selectors of the tags.
	 * @param attributes The attributes of the innermost tag.
	 * @param children The children of the innermost tag.
	 */
	constructor(
		selectors: [...S],
		attributes: AttributesArg<SelectorName<LS>> = {},
		children?: ChildrenArg<SelectorName<LS>>
	) {
		if (!selectors || selectors.length < 2) throw new Error('Compound tags must have at least two selectors.');
		this.innerTag = new Tag(selectors.pop(), attributes, children);
		this.tags.unshift(this.innerTag);
		this.outerTag = selectors.reduceRight((child, selector) => {
			const tag = new Tag(selector, {}, [child] as any);
			this.tags.unshift(tag);
			return tag;
		}, this.innerTag);
	}

	/**
	 * Returns the HTML string representation of the tag.
	 * @returns The HTML string representation of the tag.
	 */
	public toString(): string {
		return this.outerTag.toString();
	}

	/**
	 * Returns the HTML string representation of the tag.
	 * @returns The HTML string representation of the tag.
	 */
	public get html(): string {
		return this.outerTag.html;
	}
}
