import type {CLI} from './cli.js';
import {ChildProcess, fork} from 'child_process';
import {FSWatcher, WatchEventType, watch} from 'fs';
import {resolve} from 'path';

/**
 * Watches for changes to the input path and recompiles the templates when a change is detected.
 */
export class Watcher {
	/** The delay before an event triggers the callback. Allows multiple simultaneous changes to be handled together. */
	private readonly delay = 250;

	/** The FSWatcher instance. */
	private readonly watcher: FSWatcher = watch(this.cli.srcCompiler.input, {recursive: true}, this.onChange.bind(this));

	/** The working directory. */
	private readonly cwd: string = process.cwd();

	/** The arguments passed to the compiler. */
	private readonly args: string[];

	/** The Timeout instance that handles the delay. */
	private timeout?: NodeJS.Timeout;

	/** Whether or not a compilation is currently in progress. */
	private inProgress: boolean = false;

	/** The child process that runs the compiler. */
	private compiler?: ChildProcess;

	private _compile?: Promise<void>;

	/**
	 * Creates a Watcher instance.
	 * @param args The arguments passed to the CLI
	 */
	constructor(private readonly cli: CLI) {
		this.args = this.cli.args.filter((arg) => arg !== '-w');
		process.on('exit', () => this.stop());
		this.compile().then(() => {
			console.log(`\nWatching for changes in ${this.cli.srcCompiler.input}`);
		});
	}

	/**
	 * Handles a change event.
	 * @param type The type of change
	 * @param file The file that changed
	 */
	private onChange(type: WatchEventType, file: string): void {
		const {input, output, srcCompiler} = this.cli;
		if (this.inProgress) return;
		if (this.timeout) clearTimeout(this.timeout);
		if (resolve(input, file).startsWith(output)) return;
		if (srcCompiler.enabled && resolve(input, file).startsWith(srcCompiler.tscDistPath)) return;

		console.log(`File ${type} - ${file}`);

		this.timeout = setTimeout(() => {
			delete this.timeout;
			this.compile();
		}, this.delay);
	}

	/**
	 * Compiles the templates.
	 */
	private async compile(): Promise<void> {
		if (this._compile) return this._compile;
		if (this.inProgress || this.compiler) return;

		this.inProgress = true;
		return this._compile = new Promise((resolve, reject) => {
			this.compiler = fork(process.argv[1], this.args, {cwd: this.cwd});
			this.compiler.on('error', reject);
			this.compiler.on('exit', () => {
				delete this.compiler;
				delete this._compile;
				this.inProgress = false;
				resolve();
			});
		});
	}

	/**
	 * Stops watching for changes and kills the compiler process if it is running.
	 */
	private stop(): void {
		this.watcher.close();
		if (this.timeout) clearTimeout(this.timeout);
		if (this.compiler) this.compiler.kill();
	}
}
