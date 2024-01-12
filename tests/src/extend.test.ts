import {describe, expect, test} from '@jest/globals';
import {$, extend} from 'whits';
import {Tag} from 'whits/tag';

declare module 'whits' {
	interface HtmlAttributeOverrides {
		foo: 'bar' | 'baz';
		div: 'boo';
	}
	interface SvgAttributeOverrides {
		bar: undefined;
	}
}

describe('Extension capability', () => {
	test('Extended tags are created properly via tag syntax', () => {
		expect(extend('foo', 'bar')).toBe($);

		const foo = $.foo({id: 'foo', bar: true, baz: 'boo'}, 'foo');
		expect(foo).toBeInstanceOf(Tag);
		expect(foo.tag).toBe('foo');
		expect(foo.isVoid).toBe(false);
		expect(foo.attributes.id).toBe('foo');
		expect(foo.attributes.bar).toBe(true);
		expect(foo.attributes.baz).toBe('boo');
		expect(foo.children).toBeInstanceOf(Array);
		expect(foo.children.length).toBe(1);
		expect(foo.children[0]).toBe('foo');
		expect(foo.html).toBe('<foo id="foo" bar baz="boo">foo</foo>');

		const bar = $.bar({id: 'bar'}, 'bar');
		expect(bar).toBeInstanceOf(Tag);
		expect(bar.tag).toBe('bar');
		expect(bar.isVoid).toBe(false);
		expect(bar.attributes.id).toBe('bar');
		expect(bar.children).toBeInstanceOf(Array);
		expect(bar.children.length).toBe(1);
		expect(bar.children[0]).toBe('bar');
		expect(bar.html).toBe('<bar id="bar">bar</bar>');
	});

	test('Extended tags are created properly via selector syntax', () => {
		const fooFactory = $('foo#foo.bar.baz');
		expect(typeof fooFactory).toBe('function');

		const foo = fooFactory({bar: true}, 'foo');
		expect(foo).toBeInstanceOf(Tag);
		expect(foo.tag).toBe('foo');
		expect(foo.isVoid).toBe(false);
		expect(foo.attributes.id).toBe('foo');
		expect(foo.attributes.bar).toBe(true);
		expect(foo.attributes.baz).toBeUndefined();
		expect(foo.attributes.class).toBe('bar baz');
		expect(foo.children).toBeInstanceOf(Array);
		expect(foo.children.length).toBe(1);
		expect(foo.children[0]).toBe('foo');
		expect(foo.html).toBe('<foo class="bar baz" id="foo" bar>foo</foo>');

		const barFactory = $('bar#bar');
		expect(typeof barFactory).toBe('function');

		const bar = barFactory('bar');
		expect(bar).toBeInstanceOf(Tag);
		expect(bar.tag).toBe('bar');
		expect(bar.isVoid).toBe(false);
		expect(bar.attributes.id).toBe('bar');
		expect(bar.attributes.class).toBe('');
		expect(bar.children).toBeInstanceOf(Array);
		expect(bar.children.length).toBe(1);
		expect(bar.children[0]).toBe('bar');
		expect(bar.html).toBe('<bar id="bar">bar</bar>');
	});
});
