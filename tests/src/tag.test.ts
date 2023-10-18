import {describe, expect, test} from '@jest/globals';
import {Tag} from '../../dist';
import {TagClass} from '../../dist/tag/class';
import {TagStyle} from '../../dist/tag/style';

describe('Tag creation and manipulation', () => {
	const tag = new Tag();

	test('Basic div tag is created properly', () => {
		expect(tag).toBeInstanceOf(Tag);
		expect(tag.tag).toBe('div');
		expect(tag.class).toBeInstanceOf(TagClass);
		expect(tag.style).toBeInstanceOf(TagStyle);
		expect(typeof tag.attributes).toBe('object');

		const attrKeys = Object.keys(tag.attributes)
		expect(attrKeys.length).toBe(2);
		expect(attrKeys.includes('class')).toBe(true);
		expect(attrKeys.includes('style')).toBe(true);
		expect(typeof tag.outerContent).toBe('object');
		expect(tag.outerContent.before).toBeNull();
		expect(tag.outerContent.after).toBeNull();
		expect(tag.children).toBeInstanceOf(Array);
		expect(tag.children.length).toBe(0);
		expect(tag.html).toBe('<div></div>');
	});

	test('Tag id can be modified properly', () => {
		tag.attributes.id = 'tag1';
		expect(tag.attributes.id).toBe('tag1');
		expect(tag.html).toBe('<div id="tag1"></div>');
	});

	test('Tag class can be modified properly', () => {
		tag.class.add('tag1a', 'tag1b');
		expect(tag.class.toString()).toBe('tag1a tag1b');

		tag.class.clear();
		expect(tag.class.toString()).toBe('');
		expect(tag.html).toBe('<div id="tag1"></div>');

		tag.class.add('tag1c', 'tag1d');
		expect(tag.class.toString()).toBe('tag1c tag1d');

		tag.class.add('tag1e');
		expect(tag.class.toString()).toBe('tag1c tag1d tag1e');

		tag.class.remove('nothing');
		expect(tag.class.toString()).toBe('tag1c tag1d tag1e');

		tag.class.remove('tag1d');
		expect(tag.class.toString()).toBe('tag1c tag1e');
		expect(tag.html).toBe('<div class="tag1c tag1e" id="tag1"></div>');
	});
});
