import {describe, expect, test} from '@jest/globals';
import {$, RawContent, raw} from 'whits';
import {Tag, CompoundTag} from 'whits/tag';

describe('Tag creation', () => {
	test('Factory function is created properly', () => {
		expect(typeof $).toBe('function');
		expect(typeof $.div).toBe('function');
	});

	test('Basic div tag is created properly via query', () => {
		const factory = $('div');
		expect(typeof factory).toBe('function');

		const tag = factory();
		expect(tag).toBeInstanceOf(Tag);
		expect(tag.tag).toBe('div');
		expect(tag.isVoid).toBe(false);
		expect(typeof tag.attributes).toBe('object');
		expect(tag.children).toBeInstanceOf(Array);
		expect(tag.children.length).toBe(0);
		expect(tag.html).toBe('<div></div>');
	});

	test('Basic div tag is created properly via factory method', () => {
		const tag = $.div();
		expect(tag).toBeInstanceOf(Tag);
		expect(tag.tag).toBe('div');
		expect(tag.isVoid).toBe(false);
		expect(typeof tag.attributes).toBe('object');
		expect(tag.children).toBeInstanceOf(Array);
		expect(tag.children.length).toBe(0);
		expect(tag.html).toBe('<div></div>');
	});

	test('Div tag with ID and class is created properly via query', () => {
		const factory = $('#tag1.tag1a.tag1b');
		expect(typeof factory).toBe('function');

		const tag = factory();
		expect(tag).toBeInstanceOf(Tag);
		expect(tag.tag).toBe('div');
		expect(tag.isVoid).toBe(false);
		expect(tag.attributes.id).toBe('tag1');
		expect(tag.class.toString()).toBe('tag1a tag1b');
		expect(tag.children).toBeInstanceOf(Array);
		expect(tag.children.length).toBe(0);
		expect(tag.html).toBe('<div class="tag1a tag1b" id="tag1"></div>');
	});

	test('Div tag with ID and class is created properly via factory method', () => {
		const tag = $.div({id: 'tag1', class: ['tag1a', 'tag1b']});
		expect(tag).toBeInstanceOf(Tag);
		expect(tag.tag).toBe('div');
		expect(tag.isVoid).toBe(false);
		expect(tag.attributes.id).toBe('tag1');
		expect(tag.class.toString()).toBe('tag1a tag1b');
		expect(tag.children).toBeInstanceOf(Array);
		expect(tag.children.length).toBe(0);
		expect(tag.html).toBe('<div class="tag1a tag1b" id="tag1"></div>');
	});

	test('Single child can be passed to factory without array', () => {
		const tag = $.div('Hello, world!');
		expect(tag).toBeInstanceOf(Tag);
		expect(tag.children).toBeInstanceOf(Array);
		expect(tag.children.length).toBe(1);
		expect(tag.children[0]).toBe('Hello, world!');

		for (const child of [
			$.span('Hello, world!'),
			$('span')('Hello, world!'),
			$.span,
			$('span'),
		]) {
			const tagX = $.div(child);
			expect(tagX).toBeInstanceOf(Tag);
			expect(tagX.children).toBeInstanceOf(Array);
			expect(tagX.children.length).toBe(1);
			expect(tagX.children[0]).toBeInstanceOf(Tag);
			expect((tagX.children[0] as Tag<'span'>).tag).toBe('span');

			const tagY = $.div({title: 'foo'}, child);
			expect(tagY).toBeInstanceOf(Tag);
			expect(tagY.children).toBeInstanceOf(Array);
			expect(tagY.children.length).toBe(1);
			expect(tagY.children[0]).toBeInstanceOf(Tag);
			expect((tagY.children[0] as Tag<'span'>).tag).toBe('span');
		}

		const cTag = $('div', 'span.foo')('Hello, world!');
		const tag2 = $.div(cTag);
		expect(tag2).toBeInstanceOf(Tag);
		expect(tag2.children).toBeInstanceOf(Array);
		expect(tag2.children.length).toBe(1);
		expect(tag2.children[0]).toBeInstanceOf(CompoundTag);
		expect((tag2.children[0] as CompoundTag<any>).innerTag.tag).toBe('span');
		expect((tag2.children[0] as CompoundTag<any>).innerTag.class.toString()).toBe('foo');

		const tag3 = $.div({title: 'bar'}, cTag);
		expect(tag3).toBeInstanceOf(Tag);
		expect(tag3.children).toBeInstanceOf(Array);
		expect(tag3.children.length).toBe(1);
		expect(tag3.children[0]).toBeInstanceOf(CompoundTag);
		expect((tag3.children[0] as CompoundTag<any>).innerTag.tag).toBe('span');
		expect((tag3.children[0] as CompoundTag<any>).innerTag.class.toString()).toBe('foo');

		const tag4 = $.div(raw('Hello, world!'));
		expect(tag4).toBeInstanceOf(Tag);
		expect(tag4.children).toBeInstanceOf(Array);
		expect(tag4.children.length).toBe(1);
		expect(tag4.children[0]).toBeInstanceOf(RawContent);
		expect((tag4.children[0] as RawContent).toString()).toBe('Hello, world!');

		const tag5 = $.div({title: 'bar'}, raw('Hello, world!'));
		expect(tag5).toBeInstanceOf(Tag);
		expect(tag5.children).toBeInstanceOf(Array);
		expect(tag5.children.length).toBe(1);
		expect(tag5.children[0]).toBeInstanceOf(RawContent);
		expect((tag5.children[0] as RawContent).toString()).toBe('Hello, world!');
	});

	test('Factory can properly create compound tags', () => {
		const cTag = $('div', 'span.foo')('Hello, world!');
		expect(cTag).toBeInstanceOf(CompoundTag);

		expect(cTag.outerTag).toBeInstanceOf(Tag);
		expect(cTag.outerTag.tag).toBe('div');
		expect(cTag.outerTag.children.length).toBe(1);
		expect(cTag.outerTag.children[0]).toBeInstanceOf(Tag);
		expect(cTag.outerTag.children[0]).toBe(cTag.innerTag);

		expect(cTag.innerTag).toBeInstanceOf(Tag);
		expect(cTag.innerTag.tag).toBe('span');
		expect(cTag.innerTag.children.length).toBe(1);
		expect(cTag.innerTag.children[0]).toBe('Hello, world!');

		expect(cTag.html).toBe('<div><span class="foo">Hello, world!</span></div>');

		const cTag2 = $('div', 'span.foo')({title: 'bar'}, 'Hello, world!');
		expect(cTag2).toBeInstanceOf(CompoundTag);

		expect(cTag2.outerTag).toBeInstanceOf(Tag);
		expect(cTag2.outerTag.tag).toBe('div');
		expect(cTag2.outerTag.children.length).toBe(1);
		expect(cTag2.outerTag.children[0]).toBeInstanceOf(Tag);
		expect(cTag2.outerTag.children[0]).toBe(cTag2.innerTag);

		expect(cTag2.innerTag).toBeInstanceOf(Tag);
		expect(cTag2.innerTag.tag).toBe('span');
		expect(cTag2.innerTag.attributes.title).toBe('bar');
		expect(cTag2.innerTag.children.length).toBe(1);
		expect(cTag2.innerTag.children[0]).toBe('Hello, world!');

		expect(cTag2.html).toBe('<div><span class="foo" title="bar">Hello, world!</span></div>');
	});
});
