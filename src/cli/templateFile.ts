import type {CLI} from './cli.js';
import {dirname} from 'path';
import {existsSync} from 'fs';
import {mkdir, writeFile} from 'fs/promises';
import {RawContent} from '../raw.js';
import {Template} from '../template.js';
import {encodeEntities} from '../utils.js';

/**
 * Represents a template file that can be used to render HTML content.
 */
export class TemplateFile {

	/** The output path of the template. */
	public readonly outputPath: string;

	/**
	 * Creates a new instance of the `TemplateFile` class.
	 * @param cli The CLI instance.
	 * @param inputPath The input path of the template.
	 * @param params The params to pass to the template.
	 */
	constructor(public readonly cli: CLI, public readonly inputPath: string) {
		const regex = new RegExp(`^${this.cli.srcCompiler.distPath}/(.*)\.js$`);
		this.outputPath = this.inputPath.replace(regex, `${this.cli.output}/$1`);
	}

	/**
	 * Resolves the template to a string.
	 * @param template The template to resolve.
	 * @returns The resolved template string.
	 */
	private async resolveTemplate(template: any): Promise<string> {
		template = await template;
		if (typeof template === 'string') return encodeEntities(template, true);
		if (template instanceof RawContent) return template.toString();
		if (template instanceof Template) return template.renderString(this.cli.params);
		throw new Error('Module must have a default export of type string, RawContent, Template, or RootTemplate');
	}

	/**
	 * Compiles the template.
	 * @returns A promise that resolves with the compiled template string.
	 */
	public async compile(): Promise<string> {
		const outputDir = dirname(this.outputPath);
		let templateModule: any;
		
		try {
			templateModule = await import(this.inputPath);
			if (!templateModule?.default) throw `Failed to load module: ${this.inputPath}`;
		} catch (error) {
			console.error('Failed to load module:', this.inputPath);
			console.error(error);
			this.cli.usage();
			process.exit(1);
		}

		try {
			const content = await this.resolveTemplate(templateModule.default);
			if (!existsSync(outputDir)) await mkdir(outputDir, {recursive: true});
			await writeFile(this.outputPath, content);
			console.log(this.outputPath);
			return content;
		} catch (error) {
			console.error(error.message);
			process.exit(1);
		}
	}
}
