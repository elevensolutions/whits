import {htmlElementAttributes} from 'html-element-attributes';

const globalTypes = htmlElementAttributes['*'];
delete htmlElementAttributes['*'];
console.log(`export type GlobalAttribute = ${globalTypes.map((value) => `'${value}'`).join(' | ')};`);

const attrMap = Object.entries(htmlElementAttributes).map(([tag, types]) => `\t'${tag}': ${types.map((value) => `'${value}'`).join(' | ')};`);
console.log(`interface AttributeMap extends Record<keyof HTMLElementTagNameMap, string> {\n${attrMap.join('\n')}\n}`);
console.log(`export type HTMLTag = keyof AttributeMap & keyof HTMLElementTagNameMap;`)
console.log(`export type HTMLAttribute<T extends HTMLTag> = AttributeMap[T];`);
