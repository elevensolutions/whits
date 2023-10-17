import type {GlobalAttribute, HTMLAttribute, HTMLTag} from './htmlAttributes';
import type {RawContent} from './raw';
import type {Tag} from './tag';

type SelectorPart = '' | `.${string}` | `#${string}`;
type AnyTag = {[K in Selector]: Tag<K>}[Selector];

export type Selector = {[K in HTMLTag]: `${K}${SelectorPart}`}[HTMLTag] | SelectorPart;
export type SelectorName<S extends Selector> = S extends `${infer T}${SelectorPart}` ? T extends '' ? 'div' : T & HTMLTag : never;
export type TagContent = (AnyTag | RawContent | string)[];
export type Attributes<T extends HTMLTag> = Record<HTMLAttribute<T> | `data-${string}` | GlobalAttribute, string | boolean>;
export type AttributesArg<T extends HTMLTag> = Partial<Attributes<T> | {
	class: string[] | Set<string>;
	style: Record<string, string> | Map<string, string>;
}>
