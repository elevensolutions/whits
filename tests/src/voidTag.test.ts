import {describe, test, expect} from '@jest/globals';
import {Tag} from '../../dist';

describe('Void tag creation and manipulation', () => {
	const tag = new Tag('img', {src: 'image.png', alt: 'An image'});

	test('Void tag is created properly', () => {
		expect(tag.tag).toBe('img');
		expect(tag.isVoid).toBe(true);
		expect(tag.attributes.src).toBe('image.png');
		expect(tag.attributes.alt).toBe('An image');
		expect(tag.children).toBeInstanceOf(Array);
		expect(tag.html).toBe('<img src="image.png" alt="An image">');
	});

	test('Void tag cannot have children', () => {
		expect(() => {
			new Tag('img', {}, 'child' as undefined) as never;
		}).toThrowError(/Void tag img cannot have children/);
		expect(() => {
			tag.children.push(new Tag('span') as never);
		}).toThrowError(/object is not extensible/);
	});
});
