import {htmlElementAttributes} from 'html-element-attributes';
import {htmlTagNames} from 'html-tag-names';
import {createWriteStream} from 'fs';
import {promisify} from 'util';

function template(tag) {
	return /* typescript */ `
		/**
		 * Creates a new \`${tag}\` \`Tag\` instance with the given attributes and content.
		 * @param attributes The attributes of the tag.
		 * @param content The children or content of the tag.
		 * @returns A new \`Tag\` instance.
		 */
		export const _${tag} = _('${tag}');
	`.replace(/\n\t\t/g, '\n');
}

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
	const writeTags = openFile('src/htmlTags.ts');
	await writeTags(`import {_} from './index.js';\n\n`);
	for (const [tag] of attrMap) await writeTags(template(tag));
}

await run();
