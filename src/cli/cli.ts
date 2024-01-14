import {Watcher} from './watcher.js';
import {DistCompiler} from './distCompiler.js';
import {SrcCompiler} from './srcCompiler.js';
import {resolve} from 'path';
import {existsSync, statSync} from 'fs';

/**
 * Represents the command line interface for the `whits` command.
 */
export class CLI {

	/** The input path passed to the CLI */
	public readonly input!: string;

	/** The output path passed to the CLI */
	public readonly output!: string;

	/** The extension module path passed to the CLI, if there is one */
	public readonly extendModule?: string;

	/** Whether the CLI should watch for changes */
	public readonly shouldWatch: boolean = false;

	/** The params object passed to the CLI */
	public readonly params: Readonly<any> = {};

	/** The SrcCompiler instance */
	public readonly srcCompiler: SrcCompiler;

	/**
	 * Creates a CLI instance.
	 */
	constructor() {
		const {args} = this;
		let extendPath: string | undefined;

		try {
			while (args.length) {
				const arg = args.shift() as string;
				if (arg === '-w') {
					this.shouldWatch = true;
				} else if (arg === '-e') {
					extendPath = args.shift();
					if (!extendPath) throw 'Missing path to extend module';
				} else if (!this.input) {
					this.input = resolve(arg.replace(/\/$/, ''));
				} else if (!this.output) {
					this.output = resolve(arg.replace(/\/$/, ''));
				} else try {
					const params = JSON.parse(arg) || {};
					Object.assign(this.params, params);
				} catch (error) {
					throw `Failed to parse param string as JSON: ${arg}\n`;
				}
			}
			this.checkPaths();
		} catch (error) {
			console.error(error + '\n');
			this.usage();
		}
		this.srcCompiler = new SrcCompiler(this);
		this.extendModule = extendPath && resolve(this.srcCompiler.distPath, extendPath.replace(/\.[tj]s$/, '') + '.js');
	}

	/**
	 * Checks the input and output paths.
	 */
	private checkPaths(): void {
		for (const dir of ['input', 'output'] as const) {
			if (!this[dir]) throw `Missing ${dir} path`;
			if (existsSync(this[dir])) {
				const stat = statSync(this[dir]);
				if (!stat.isDirectory()) throw `${dir.replace(/^\w/, (m) => m.toUpperCase())} path is not a directory: ${this[dir]}`;
			}
		}
		if (!existsSync(this.input)) throw `Input directory does not exist: ${this.input}`;
	}

	/**
	 * Prints the usage message and exits the CLI.
	 */
	public usage(): void {
		console.error('Usage: whits [-w] [-e <extend>] <input> <output> [...params]');
		console.error('  -w     - watch for changes');
		console.error('  -e     - extend whits with a module that adds new tags');
		console.error('  extend - path to a module that extends whits, relative to the input directory');
		console.error('  input  - path to the input directory');
		console.error('  output - path to the output directory');
		console.error('  params - JSON-formatted object of params to pass to the templates');
		process.exit(1);
	}

	/**
	 * Compiles the templates.
	 * @returns A promise that resolves when the templates are compiled.
	 */
	public async compile(): Promise<void> {
		try {
			await this.srcCompiler.compile();
		} catch (error) {
			console.error('TSC failed, cannot continue.');
			process.exit(error);
		}
		try {
			const distCompiler = new DistCompiler(this);
			await distCompiler.compile();
		} catch (error) {
			if (error) console.error(error.message || error);
			process.exit(1);
		}
	}

	/**
	 * Watches for changes in the input directory.
	 * @returns A Watcher instance.
	 */
	public watch(): Watcher | undefined {
		if (this.shouldWatch) return new Watcher(this);
	}

	/**
	 * Gets the arguments passed to the CLI.
	 * @returns An array of arguments.
	 */
	public get args(): string[] {
		return process.argv.slice(2);
	}
}
