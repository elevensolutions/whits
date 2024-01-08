#!/usr/bin/env node

import {existsSync} from 'fs';
import {stat, readdir, writeFile, mkdir} from 'fs/promises';
import {dirname, resolve} from 'path';
import {RawContent} from './raw.js';

class TemplateFile {
	public readonly outputPath: string;
	public content?: string;

	private constructor(public readonly basePath: string, public readonly inputPath: string) {
		const regex = new RegExp(`^${basePath}/(.*)\.js$`);
		this.outputPath = this.inputPath.replace(regex, '$1');
	}

	private async load(): Promise<void> {
		const inputPath = resolve(this.inputPath);
		try {
			const templateModule: {default: RawContent} = await import(inputPath);
			if (!(templateModule.default instanceof RawContent)) throw new Error('Module must export the the result of Template.render()');
			this.content = templateModule.default.toString();
		} catch (error) {
			console.error('Failed to load module:', inputPath);
			console.dir(error);
		}
	}

	public static async load(basePath: string, inputPath: string): Promise<TemplateFile> {
		const template = new TemplateFile(basePath, inputPath);
		await template.load();
		return template;
	}
}

class CLI {
	private readonly input: string = process.argv[2]?.replace(/\/$/, '');
	private readonly output: string = process.argv[3]?.replace(/\/$/, '');

	constructor() {
		if (!this.input || !this.output) this.usage();
	}

	private usage(): void {
		console.error('Usage: whits <input> <output>');
		console.error('  input  - path to the input file or directory');
		console.error('  output - path to the output directory');
		process.exit(1);
	}

	private async getInputs(inputPath: string): Promise<string[]> {
		const inStat = await stat(inputPath);
		if (inStat.isDirectory()) return (
			await Promise.all(
				(await readdir(inputPath)).map((file) => this.getInputs(inputPath + '/' + file))
			)
		).flat().filter((input) => input.endsWith('.html.js'));
		return [inputPath];
	}

	private async getTemplates(inputPath: string): Promise<TemplateFile[]> {
		const inputs = await this.getInputs(inputPath);
		return (await Promise.all(inputs.map((input) => TemplateFile.load(this.input, input)))).filter((file) => file.content);
	}

	public async compile(): Promise<void> {
		try {
			if (!existsSync(this.input)) throw new Error(`Input file or directory does not exist: ${this.input}`);
			if (existsSync(this.output) && !(await stat(this.output)).isDirectory()) throw new Error(`Output path is not a directory: ${this.output}`);

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
