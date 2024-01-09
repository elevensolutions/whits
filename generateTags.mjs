import {htmlElementAttributes} from 'html-element-attributes';
import {svgElementAttributes} from 'svg-element-attributes';
import {htmlTagNames} from 'html-tag-names';
import {svgTagNames} from 'svg-tag-names';
import {createWriteStream} from 'fs';
import {promisify} from 'util';

function openFile(path) {
	const output = createWriteStream(path, {flags: 'w'});
	return promisify(output.write).bind(output);
}

/**
 * Generates the HTML or SVG tag and attribute types.
 * @param {'html' | 'svg'} language The language to generate the types for.
 */
async function run(language) {
	const attributes = language === 'html' ? htmlElementAttributes : svgElementAttributes;
	const tagNames = language === 'html' ? htmlTagNames.filter((tag) => tag !== 'svg') : svgTagNames;
	const langUpper = language.toUpperCase();

	const globalTypes = attributes['*'];
	delete attributes['*'];
	const attrMap = Object.entries(attributes);
	attrMap.push(...tagNames.filter((tag) => !attrMap.find(([attrTag]) => attrTag === tag)).map((tag) => [tag, []]));
	const attrMapString = attrMap.map(([tag, types]) => `\t'${tag}': ${types.map((value) => `'${value}'`).join(' | ') || 'undefined'};`);


	// Write attributes
	const writeAttrs = openFile(`src/${language}Attributes.ts`);
	await writeAttrs(`export type ${langUpper}GlobalAttribute = ${globalTypes.map((value) => `'${value}'`).join(' | ')};\n`);
	await writeAttrs(`export interface ${langUpper}AttributeMap extends Record<keyof ${langUpper}ElementTagNameMap, string | undefined> {\n${attrMapString.join('\n')}\n}\n`);
	await writeAttrs(`export type ${langUpper}Tag = keyof ${langUpper}AttributeMap;\n`)
	await writeAttrs(`export type ${langUpper}Attribute<T extends ${langUpper}Tag> = ${langUpper}AttributeMap[T] extends string ? ${langUpper}AttributeMap[T] : never;\n`);

	// Write tags
	const writeTags = openFile(`src/tag/${language}Tags.ts`);
	await writeTags(`import {tagFactory as $} from './factory.js';\n\n`);
	await writeTags(`export const ${language}Tags = {\n`);
	for (const [tag] of attrMap) await writeTags(`\t'${tag}': $('${tag}'),\n`);
	await writeTags(`} as const;\n`);
}

await run('html');
await run('svg');
