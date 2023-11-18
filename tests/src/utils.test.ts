import {describe, expect, test} from '@jest/globals';
import {$, Tag, encodeEntities, loop} from '../../dist';

describe('Utils', () => {
	test('Entities are encoded properly', () => {
		expect(encodeEntities('')).toBe('');
		expect(encodeEntities('Hello, world!')).toBe('Hello, world!');
		expect(encodeEntities('Hello, <b>world</b>!')).toBe('Hello, &lt;b&gt;world&lt;/b&gt;!');
		expect(encodeEntities('Hello, & <b>world</b>!')).toBe('Hello, &amp; &lt;b&gt;world&lt;/b&gt;!');
		expect(encodeEntities('"Hello"')).toBe('&quot;Hello&quot;');
		expect(encodeEntities('☺')).toBe('&#9786;');
		expect(encodeEntities('©')).toBe('&copy;');
		expect(encodeEntities('®')).toBe('&reg;');
		expect(encodeEntities('™')).toBe('&trade;');
		expect(encodeEntities('𝄞')).toBe('&#119070;');
	});

	test('Loop function works properly', () => {
		expect(loop(0, () => 'a')).toEqual([]);
		expect(loop(1, () => 'a')).toEqual(['a']);
		expect(loop(2, () => 'a')).toEqual(['a', 'a']);
		expect(loop(3, (i) => i.toString())).toEqual(['0', '1', '2']);

		const lines = loop(3, (i) => $.li(`Line ${i}`));
		expect(lines).toBeInstanceOf(Array);
		expect(lines.length).toBe(3);
		expect(lines[0]).toBeInstanceOf(Tag);
		expect(lines[1]).toBeInstanceOf(Tag);
		expect(lines[2]).toBeInstanceOf(Tag);
		expect((lines[0] as Tag<'li'>).tag).toBe('li');
		expect((lines[1] as Tag<'li'>).tag).toBe('li');
		expect((lines[2] as Tag<'li'>).tag).toBe('li');
		expect((lines[0] as Tag<'li'>).children.length).toBe(1);
		expect((lines[1] as Tag<'li'>).children.length).toBe(1);
		expect((lines[2] as Tag<'li'>).children.length).toBe(1);
		expect((lines[0] as Tag<'li'>).children[0]).toBe('Line 0');
		expect((lines[1] as Tag<'li'>).children[0]).toBe('Line 1');
		expect((lines[2] as Tag<'li'>).children[0]).toBe('Line 2');
		expect((lines[0] as Tag<'li'>).html).toBe('<li>Line 0</li>');
		expect((lines[1] as Tag<'li'>).html).toBe('<li>Line 1</li>');
		expect((lines[2] as Tag<'li'>).html).toBe('<li>Line 2</li>');
	});
});
