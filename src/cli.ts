#!/usr/bin/env node

import {existsSync} from 'fs';
import {stat, readdir, writeFile, mkdir} from 'fs/promises';
import {dirname, resolve} from 'path';
import {RawContent} from './raw.js';
import {Template} from './template.js';
import {encodeEntities} from './utils.js';

/**
 * Represents a template file that can be used to render HTML content.
 */
class TemplateFile {

	/** The output path of the template. */
	public readonly outputPath: string;

	/** The rendered content of the template. */
	public content?: string;

	/**
	 * Creates a new instance of the `TemplateFile` class.
	 * @param basePath The base path of the template.
	 * @param inputPath The input path of the template.
	 * @param params The params to pass to the template.
	 */
	private constructor(public readonly basePath: string, public readonly inputPath: string, public readonly params: any) {
		const regex = new RegExp(`^${basePath}/(.*)\.js$`);
		this.outputPath = this.inputPath.replace(regex, '$1');
	}

	/**
	 * Loads the template file.
	 * @returns A promise that resolves when the template file is loaded.
	 */
	private async load(): Promise<void> {
		const inputPath = resolve(this.inputPath);
		try {
			const {default: template} = await import(inputPath);
			this.content = this.resolveTemplate(template);
		} catch (error) {
			console.error('Failed to load module:', inputPath);
			console.dir(error);
		}
	}

	/**
	 * Resolves the template to a string.
	 * @param template The template to resolve.
	 * @returns The resolved template string.
	 */
	private resolveTemplate(template: any): string {
		if (typeof template === 'string') return encodeEntities(template);
		if (template instanceof RawContent) return template.toString();
		if (template instanceof Template) return template.renderString(this.params);
		throw new Error('Module must have a default export of type string, RawContent, Template, or RootTemplate');
	}

	/**
	 * Loads a template file.
	 * @param basePath The base path of the template.
	 * @param inputPath The input path of the template.
	 * @param params The params to pass to the template.
	 * @returns A promise that resolves with the TemplateFile instance.
	 */
	public static async load(basePath: string, inputPath: string, params: any): Promise<TemplateFile> {
		const template = new TemplateFile(basePath, inputPath, params);
		await template.load();
		return template;
	}
}

/**
 * Represents the command line interface for the `whits` command.
 */
class CLI {

	/** The input path passed to the CLI */
	private input?: string;

	/** The output path passed to the CLI */
	private output?: string;

	/** The params object passed to the CLI */
	public readonly params: any = {};

	/**
	 * Processes the CLI arguments.
	 * @returns A promise that resolves when the arguments are processed.
	 */
	private async processArgs(): Promise<void> {
		const args = process.argv.slice(2);
		while (args.length) {
			const arg = args.shift() as string;
			if (arg === '-e') {
				const extend = args.shift();
				if (!extend) throw 'Missing path to extend module';
				try {
					await import(resolve(extend));
				} catch (error) {
					throw `Failed to load extend module: ${extend}`;
				}
				continue;
			}
			if (!this.input) {
				this.input = arg.replace(/\/$/, '');
				continue;
			}
			if (!this.output) {
				this.output = arg.replace(/\/$/, '');
				continue;
			}
			try {
				const params = JSON.parse(arg) || {};
				Object.assign(this.params, params);
			} catch (error) {
				throw `Failed to parse param string as JSON: ${arg}\n`;
			}
		}
	}

	/**
	 * Prints the usage message and exits the CLI.
	 */
	private usage(): void {
		console.error('Usage: whits [-e <extend>] <input> <output> [...params]');
		console.error('  extend - path to a module that extends whits with new tags');
		console.error('  input  - path to the input file or directory');
		console.error('  output - path to the output directory');
		console.error('  params - JSON-formatted object of params to pass to the templates');
		process.exit(1);
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
		return (await Promise.all(inputs.map((input) => TemplateFile.load(this.input as string, input, this.params)))).filter((file) => file.content);
	}

	/**
	 * Compiles the templates.
	 * @returns A promise that resolves when the templates are compiled.
	 */
	public async compile(): Promise<void> {
		try {
			await this.processArgs();
			if (!this.input) throw 'Missing input path';
			if (!this.output) throw 'Missing output path';
			if (!existsSync(this.input)) throw `Input file or directory does not exist: ${this.input}`;
			if (existsSync(this.output) && !(await stat(this.output)).isDirectory()) throw `Output path is not a directory: ${this.output}`;
		} catch (error) {
			console.error(error);
			return this.usage();
		}
		try {
			const templates = await this.getTemplates(this.input);
			if (!templates.length) throw new Error('No templates found in input path');

			for (const template of templates) {
				const output = resolve(this.output, template.outputPath);
				const outputDir = dirname(output);
				if (!existsSync(outputDir)) await mkdir(outputDir, {recursive: true});
				await writeFile(output, template.content as string);
				console.log(template.outputPath);
			}
		} catch (error) {
			console.error(error.message);
			process.exit(1);
		}
	}
}

const cli = new CLI();
cli.compile();
