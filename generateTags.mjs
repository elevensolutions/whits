import {htmlElementAttributes} from 'html-element-attributes';
import {htmlTagNames} from 'html-tag-names';
import {createWriteStream} from 'fs';
import {promisify} from 'util';

function openFile(path) {
	const output = createWriteStream(path, {flags: 'w'});
	return promisify(output.write).bind(output);
}

async function run() {
	const globalTypes = htmlElementAttributes['*'];
	delete htmlElementAttributes['*'];
	const attrMap = Object.entries(htmlElementAttributes);
	attrMap.push(...htmlTagNames.filter((tag) => !attrMap.find(([attrTag]) => attrTag === tag)).map((tag) => [tag, []]));
	const attrMapString = attrMap.map(([tag, types]) => `\t'${tag}': ${types.map((value) => `'${value}'`).join(' | ') || 'undefined'};`);


	// Write attributes
	const writeAttrs = openFile('src/htmlAttributes.ts');
	await writeAttrs(`export type GlobalAttribute = ${globalTypes.map((value) => `'${value}'`).join(' | ')};\n`);
	await writeAttrs(`interface AttributeMap extends Record<keyof HTMLElementTagNameMap, string | undefined> {\n${attrMapString.join('\n')}\n}\n`);
	await writeAttrs(`export type HTMLTag = keyof AttributeMap;\n`)
	await writeAttrs(`export type HTMLAttribute<T extends HTMLTag> = AttributeMap[T] extends string ? AttributeMap[T] : never;\n`);

	// Write tags
	const writeTags = openFile('src/tag/htmlTags.ts');
	await writeTags(`import {tagFactory as $} from './factory.js';\n\n`);
	await writeTags(`export const tags = {\n`);
	for (const [tag] of attrMap) await writeTags(`\t${tag}: $('${tag}'),\n`);
	await writeTags(`} as const;\n`);
}

await run();
