import {describe, expect, test} from '@jest/globals';
import {RawContent, Tag, comment, css, javascript, raw} from '../../dist';

describe('Raw content', () => {
	test('RawContent instance is created properly via template literal', () => {
		const content = raw`<div></div>`;
		expect(content).toBeInstanceOf(RawContent);
		expect(content.toString()).toBe('<div></div>');
	});

	test('RawContent instance is created properly via function call', () => {
		const content = raw('<div></div>');
		expect(content).toBeInstanceOf(RawContent);
		expect(content.toString()).toBe('<div></div>');
	});
});

describe('Comment', () => {
	test('Comment is created properly via template literal', () => {
		const inner = 'comment';
		const content = comment`This is a ${inner}.`;
		expect(content).toBeInstanceOf(RawContent);
		expect(content.toString()).toBe('<!-- This is a comment. -->');
	});

	test('Comment is created properly via function call', () => {
		const inner = 'comment';
		const content = comment(`This is a ${inner}.`);
		expect(content).toBeInstanceOf(RawContent);
		expect(content.toString()).toBe('<!-- This is a comment. -->');
	});
});

describe('JavaScript and CSS', () => {
	test('Script tag is created properly via template literal', () => {
		const tag = javascript`
			const message = 'Hello, world!';
			console.log(message);
		`;
		expect(tag).toBeInstanceOf(Tag);
		expect(tag.tag).toBe('script');
		expect(tag.isVoid).toBe(false);
		expect(tag.children.length).toBe(1);
		expect(tag.children[0]).toBeInstanceOf(RawContent);
		expect(tag.toString()).toBe('<script>\nconst message = \'Hello, world!\';\nconsole.log(message);\n</script>');
		expect(tag.html).toBe('<script>\nconst message = \'Hello, world!\';\nconsole.log(message);\n</script>');
	});

	test('Style tag is created properly via template literal', () => {
		const tag = css`
			body {
				background-color: #000;
			}
		`;
		expect(tag).toBeInstanceOf(Tag);
		expect(tag.tag).toBe('style');
		expect(tag.isVoid).toBe(false);
		expect(tag.children.length).toBe(1);
		expect(tag.children[0]).toBeInstanceOf(RawContent);
		expect(tag.toString()).toBe('<style>\nbody {\n\tbackground-color: #000;\n}\n</style>');
		expect(tag.html).toBe('<style>\nbody {\n\tbackground-color: #000;\n}\n</style>');
	});
});
