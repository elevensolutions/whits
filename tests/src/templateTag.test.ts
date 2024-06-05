import {describe, expect, test} from '@jest/globals';
import {RawContent, comment, css, javascript, raw, _, $} from 'whits';
import {Tag} from 'whits/tag';

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

	test('RawContent instance can be cloned', () => {
		const content = raw('<div></div>');
		const clone = content.clone();
		expect(clone).toBeInstanceOf(RawContent);
		expect(clone.toString()).toBe('<div></div>');
		expect(clone).not.toBe(content);
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

describe('Tag children interpolation', () => {
	test('Tag children are created properly via template literal', () => {
		const children = _`Hello, ${'world'} / ${$.span('foo')} / ${$.i({title: 'faz'}, 'bar')} ${$.br} baz!`;
		const tag = $.div(children);
		expect(children).toBeInstanceOf(Array);
		expect(children.length).toBe(9);
		expect(children[0]).toBe('Hello, ');
		expect(children[1]).toBe('world');
		expect(children[2]).toBe(' / ');
		expect(children[3]).toBeInstanceOf(Tag);
		expect((children[3] as Tag<'span'>).tag).toBe('span');
		expect((children[3] as Tag<'span'>).children).toEqual(['foo']);
		expect(children[4]).toBe(' / ');
		expect(children[5]).toBeInstanceOf(Tag);
		expect((children[5] as Tag<'i'>).tag).toBe('i');
		expect((children[5] as Tag<'i'>).attributes.title).toBe('faz');
		expect((children[5] as Tag<'i'>).children).toEqual(['bar']);
		expect(children[6]).toBe(' ');
		expect(typeof children[7]).toBe('function');
		expect(children[8]).toBe(' baz!');
		expect(tag).toBeInstanceOf(Tag);
		expect(tag.children).toBeInstanceOf(Array);
		expect(tag.toString()).toBe('<div>Hello, world / <span>foo</span> / <i title="faz">bar</i> <br> baz!</div>');
	});

	test('Interpolation template tag properly condenses whitespace', () => {
		const tag = $.div(_`
			Line 1
			Line  <a> 2  </a>  
			 Line   3
			${$.a('Link')}  within a ${$.b(' li')}ne
		`);
		expect(tag).toBeInstanceOf(Tag);
		expect(tag.children).toBeInstanceOf(Array);
		expect(tag.toString()).toBe('<div> Line 1 Line &lt;a&gt; 2 &lt;/a&gt; Line 3 <a>Link</a> within a <b> li</b>ne </div>');
	});

	test('Interpolation template tag works without any expressions', () => {
		const children = _`Hello, world!`;
		const tag = $.div(children);
		expect(children).toBeInstanceOf(Array);
		expect(children.length).toBe(1);
		expect(children[0]).toBe('Hello, world!');
		expect(tag).toBeInstanceOf(Tag);
		expect(tag.children).toBeInstanceOf(Array);
		expect(tag.toString()).toBe('<div>Hello, world!</div>');
	});

	test('Interpolation template tag works without any content', () => {
		const children = _``;
		const tag = $.div(children);
		expect(children).toBeInstanceOf(Array);
		expect(children.length).toBe(0);
		expect(tag).toBeInstanceOf(Tag);
		expect(tag.children).toBeInstanceOf(Array);
		expect(tag.toString()).toBe('<div></div>');
	});

	test('Interpolation template tag works when it starts with an expression', () => {
		const children = _`${$.div('foo')} bar`;
		const tag = $.div(children);
		expect(children).toBeInstanceOf(Array);
		expect(children.length).toBe(2);
		expect(children[0]).toBeInstanceOf(Tag);
		expect((children[0] as Tag<'div'>).tag).toBe('div');
		expect((children[0] as Tag<'div'>).children).toEqual(['foo']);
		expect(children[1]).toBe(' bar');
		expect(tag).toBeInstanceOf(Tag);
		expect(tag.children).toBeInstanceOf(Array);
		expect(tag.toString()).toBe('<div><div>foo</div> bar</div>');
	});

	test('Interpolation template tag works when it ends with an expression', () => {
		const children = _`foo ${$.div('bar')}`;
		const tag = $.div(children);
		expect(children).toBeInstanceOf(Array);
		expect(children.length).toBe(2);
		expect(children[0]).toBe('foo ');
		expect(children[1]).toBeInstanceOf(Tag);
		expect((children[1] as Tag<'div'>).tag).toBe('div');
		expect((children[1] as Tag<'div'>).children).toEqual(['bar']);
		expect(tag).toBeInstanceOf(Tag);
		expect(tag.children).toBeInstanceOf(Array);
		expect(tag.toString()).toBe('<div>foo <div>bar</div></div>');
	});
});
