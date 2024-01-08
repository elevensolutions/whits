import {HTMLTag} from './htmlAttributes.js';
import {RawContent} from './raw.js';
import {htmlTags} from './tag/htmlTags.js';
import {Tag} from './tag/tag.js';
import type {AnyHtmlTag, NonVoidSelectorString, NonVoidTagName, TagChild, TagContent} from './types.js';
import {encodeEntities} from './utils.js';

/**
 * Valid types for the content of a template.
 * Can be a Tag instance, raw content, a string, or an array of any of these.
 */
type TemplateContent = TagContent<HTMLTag> | RawContent | AnyHtmlTag | string;

/**
 * Valid types for the params of a template.
 * Can be any object or void.
 */
type TemplateParams = {} | void | undefined;

/**
 * A template that can be used to render HTML content.
 * @template T The type of the template's params.
 */
export class Template<T extends TemplateParams = void> {
	/**
	 * Creates a new template.
	 * @param content The content of the template, or a function that returns the content.
	 */
	constructor(
		public readonly content: TemplateContent | ((params: T) => TemplateContent)
	) {}

	/**
	 * Renders the template with the given params (if `content` is a function).
	 * @param params The params to pass to the template.
	 * @returns The rendered template.
	 */
	public renderString(params: T): string {
		const content = typeof this.content === 'function' ? this.content(params) : this.content;
		return Array.isArray(content) ? content.map((child) => this.stringifyContent(child)).join('') : this.stringifyContent(content) || '';
	}

	/**
	 * Renders the template with the given params (if `content` is a function).
	 * @param params The params to pass to the template.
	 * @returns The rendered template as a `RawContent` instance.
	 */
	public render(params: T): RawContent {
		return new RawContent(this.renderString(params));
	}

	/**
	 * Returns the HTML string representation of a child of the template.
	 * @param child The child to stringify.
	 * @returns The HTML string representation of the child.
	 */
	private stringifyContent(child?: TagChild<any>): string {
		if (!child) return '';
		if (child instanceof Tag) return child.html;
		if (child instanceof RawContent) return child.toString();
		return encodeEntities(child);
	}
}

/**
 * A template that can be used to render the root HTML content.
 * Automatically adds a doctype and root tag to the rendered content.
 * @template T The type of the template's params.
 */
export class RootTemplate<T extends TemplateParams = void> extends Template<T> {
	/**
	 * Creates a new root template.
	 * @param content The content of the template, or a function that returns the content.
	 * @param doctype The doctype tag to use for the template. Defaults to `<!DOCTYPE html>`. Set to `null` to disable.
	 * @param rootTag The root tag to use for the template. Defaults to `html`.
	 */
	constructor(
		content: TemplateContent | ((params: T) => TemplateContent),
		public doctype: string | null = '<!DOCTYPE html>',
		public rootTag: NonVoidTagName | ((params: T, content: RawContent) => Tag<NonVoidSelectorString>) = 'html'
	) {
		super(content);
	}

	/**
	 * Renders the template with the given params (if `content` is a function).
	 * @param params The params to pass to the template.
	 * @returns The rendered template.
	 */
	public renderString(params: T): string {
		const doctype = this.doctype ? `${this.doctype}\n` : '';
		const content = new RawContent(super.renderString(params));
		const rootTag = typeof this.rootTag === 'function' ? this.rootTag(params, content) : htmlTags[this.rootTag](content);
		return doctype + rootTag.toString();
	}
}
