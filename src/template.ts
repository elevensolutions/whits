import {RawContent} from './raw.js';
import {AnyTag, TagContent} from './types.js';

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
	 * @param doctype The doctype tag to use for the template. Defaults to `<!DOCTYPE html>`. Set to `null` to disable.
	 */
	constructor(
		public readonly content: TemplateContent | ((locals: T) => TemplateContent),
		public doctype: string | null = '<!DOCTYPE html>'
	) {}

	/**
	 * Renders the template with the given locals (if `content` is a function).
	 * @param locals The locals to pass to the template.
	 * @returns The rendered template.
	 */
	public render(locals: T): string {
		const content = typeof this.content === 'function' ? this.content(locals) : this.content;
		return (this.doctype || '') + 
			(Array.isArray(content) ? content.map((child) => child.toString()).join('') : content?.toString() || '');
	}
}
