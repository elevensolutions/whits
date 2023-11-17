import {RawContent} from './raw.js';
import {tags} from './tag/htmlTags.js';
import {Tag} from './tag/tag.js';
import {raw} from './templateTags.js';
import type {AnyTag, NonVoidSelectorString, NonVoidTagName, TagChild, TagContent} from './types.js';
import {encodeEntities} from './utils.js';

/**
 * Valid types for the content of a template.
 * Can be a Tag instance, raw content, a string, or an array of any of these.
 */
type TemplateContent = TagContent | RawContent | AnyTag | string;

/**
 * A template that can be used to render HTML content.
 * @template T The type of the template's locals.
 */
export class Template<T = void> {
	/**
	 * Creates a new template.
	 * @param content The content of the template, or a function that returns the content.
	 */
	constructor(
		public readonly content: TemplateContent | ((locals: T) => TemplateContent)
	) {}

	/**
	 * Renders the template with the given locals (if `content` is a function).
	 * @param locals The locals to pass to the template.
	 * @returns The rendered template.
	 */
	public render(locals: T): string {
		const content = typeof this.content === 'function' ? this.content(locals) : this.content;
		return Array.isArray(content) ? content.map((child) => this.stringifyContent(child)).join('') : this.stringifyContent(content) || '';
	}

	/**
	 * Returns the HTML string representation of a child of the template.
	 * @param child The child to stringify.
	 * @returns The HTML string representation of the child.
	 */
	private stringifyContent(child?: TagChild): string {
		if (!child) return '';
		if (child instanceof Tag) return child.html;
		if (child instanceof RawContent) return child.toString();
		return encodeEntities(child);
	}
}

/**
 * A template that can be used to render the root HTML content.
 * Automatically adds a doctype and root tag to the rendered content.
 * @template T The type of the template's locals.
 */
export class RootTemplate<T = void> extends Template<T> {
	/**
	 * Creates a new root template.
	 * @param content The content of the template, or a function that returns the content.
	 * @param doctype The doctype tag to use for the template. Defaults to `<!DOCTYPE html>`. Set to `null` to disable.
	 * @param rootTag The root tag to use for the template. Defaults to `html`.
	 */
	constructor(
		content: TemplateContent | ((locals: T) => TemplateContent),
		public doctype: string | null = '<!DOCTYPE html>',
		public rootTag: NonVoidTagName | ((locals: T, content: RawContent) => Tag<NonVoidSelectorString>) = 'html'
	) {
		super(content);
	}

	/**
	 * Renders the template with the given locals (if `content` is a function).
	 * @param locals The locals to pass to the template.
	 * @returns The rendered template.
	 */
	public render(locals: T): string {
		const doctype = this.doctype ? `${this.doctype}\n` : '';
		const content = raw(super.render(locals));
		const rootTag = typeof this.rootTag === 'function' ? this.rootTag(locals, content) : tags[this.rootTag](content);
		return doctype + rootTag.toString();
	}
}
