import {describe, expect, test} from '@jest/globals';
import {$, Tag} from '../../dist';

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
});
