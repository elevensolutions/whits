import type {CLI} from './cli.js';
import {existsSync, readFileSync, readdirSync} from 'fs';
import {spawn} from 'child_process';
import {resolve} from 'path';

/**
 * Represents a compiler for TypeScript source files.
 */
export class SrcCompiler {

	/** Whether or not the TypeScript compiler is enabled. */
	public readonly enabled: boolean;
	
	/** The path to the compiled TypeScript files. */
	public readonly tscDistPath: string;

	/** The path to the files for the SrcCompiler to consume. */
	public readonly input: string;

	/** The path to the files for the DistCompiler to consume. */
	public readonly distPath: string;

	/** The arguments passed to the TypeScript compiler. */
	private readonly tscArgs: string[];

	/**
	 * Creates a SrcCompiler instance.
	 * @param cli The CLI instance.
	 */
	constructor(private readonly cli: CLI) {
		const hasConfig = existsSync(this.cli.input + '/tsconfig.json');
		const hasTsFiles = !!readdirSync(this.cli.input).find((file) => file.endsWith('.ts'));
		const config = hasConfig && JSON.parse(readFileSync(this.cli.input + '/tsconfig.json').toString());
		const outDir = config?.compilerOptions?.outDir;

		this.enabled = hasConfig || hasTsFiles;
		this.tscDistPath = outDir ? resolve(this.cli.input, outDir) : resolve('.whits-dist');
		this.input = config?.compilerOptions?.rootDir || this.cli.input;
		this.distPath = this.enabled ? this.tscDistPath : this.cli.input;
		this.tscArgs = hasConfig ? ['-b'] : ['--outDir', `'${this.tscDistPath}'`, '-m', 'nodenext', '-t', 'es2020', '*.ts'];
	}
	
	/**
	 * Compiles the TypeScript files.
	 * @returns A promise that resolves when the files are compiled.
	 */
	public async compile(): Promise<void> {
		if (!this.enabled) return;
		await new Promise<void>((resolve, reject) => {
			const compiler = spawn('npx', ['tsc', ...this.tscArgs], {shell: true, cwd: this.cli.input, stdio: 'inherit'});
			compiler.on('exit', (code) => {
				code ? reject(code) : resolve();
			});
			compiler.on('error', reject);
		});
	}
}
