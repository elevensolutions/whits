import type {CLI} from './cli.js';
import {readdir, stat} from 'fs/promises';
import {TemplateFile} from './templateFile.js';

/**
 * Represents a compiler that converts compiled JavaScript template files into HTML files.
 * This is the second step after the TypeScript files have been compiled into JavaScript.
 */
export class DistCompiler {
	/** Whether or not the extend module has been loaded. */
	private isExtended: boolean = false;

	/**
	 * Creates a DistCompiler instance.
	 * @param cli The CLI instance.
	 */
	constructor(private readonly cli: CLI) {}

	/**
	 * Loads the extend module, if there is one.
	 * @returns A promise that resolves when the extend module is loaded.
	 */
	private async extend(): Promise<void> {
		if (this.isExtended || !this.cli.extendModule) return;
		try {
			await import(this.cli.extendModule);
		} catch (error) {
			throw `Failed to load extend module: ${this.cli.extendModule}`;
		}
	}
	
	/**
	 * Gets the input paths for all the files to compile.
	 * @param inputPath The input path to get the inputs from.
	 * @returns A promise that resolves with an array of input paths.
	 */
	private async getInputs(inputPath: string): Promise<string[]> {
		const inStat = await stat(inputPath);
		if (inStat.isDirectory()) return (
			await Promise.all(
				(await readdir(inputPath)).map((file) => this.getInputs(inputPath + '/' + file))
			)
		).flat().filter((input) => input.endsWith('.html.js'));
		return [inputPath];
	}

	/**
	 * Gets the templates to compile.
	 * @param inputPath The input path to get the templates from.
	 * @returns A promise that resolves with an array of TemplateFile instances.
	 */
	private async getTemplates(inputPath: string): Promise<TemplateFile[]> {
		const inputs = await this.getInputs(inputPath);
		return inputs.map((input) => new TemplateFile(this.cli, input));
	}

	/**
	 * Compiles the templates.
	 * @returns A promise that resolves when the templates are compiled.
	 */
	public async compile(): Promise<void> {
		const input = this.cli.srcCompiler.distPath;

		await this.extend();
		const templates = await this.getTemplates(input);
		if (!templates.length) throw 'No templates found in input path';

		await Promise.all(templates.map((template) => template.compile()));
	}
}
