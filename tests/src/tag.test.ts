import {describe, expect, test} from '@jest/globals';
import {$, RawContent, Tag, comment, raw} from '../../dist';
import {TagClass} from '../../dist/tag/class';
import {TagStyle} from '../../dist/tag/style';
import {Selector} from '../../dist/tag/selector';

describe('Tag creation and manipulation', () => {
	const tag = new Tag();

	test('Basic div tag is created properly', () => {
		expect(tag).toBeInstanceOf(Tag);
		expect(tag.tag).toBe('div');
		expect(tag.isVoid).toBe(false);
		expect(tag.class).toBeInstanceOf(TagClass);
		expect(tag.style).toBeInstanceOf(TagStyle);
		expect(typeof tag.attributes).toBe('object');

		const attrKeys = Object.keys(tag.attributes)
		expect(attrKeys.length).toBe(3);
		expect(attrKeys.includes('class')).toBe(true);
		expect(attrKeys.includes('style')).toBe(true);
		expect(attrKeys.includes('id')).toBe(true);
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

		tag.class = new TagClass(['tag2a', 'tag2b']);
		expect(tag.class.toString()).toBe('tag2a tag2b');
		expect(tag.html).toBe('<div class="tag2a tag2b" id="tag1"></div>');
	});

	test('Tag style can be modified properly', () => {
		tag.style.set('color', 'red');
		expect(tag.style.size).toBe(1);
		expect(tag.style.has('color')).toBe(true);
		expect(tag.style.has('font-size')).toBe(false);
		expect(tag.style.get('color')).toBe('red');
		expect(tag.style.get('font-size')).toBeUndefined();
		expect(tag.style.toString()).toBe('color: red;');
		expect(tag.html).toBe('<div class="tag2a tag2b" style="color: red;" id="tag1"></div>');

		tag.style.set('font-size', '12px');
		expect(tag.style.size).toBe(2);
		expect(tag.style.has('color')).toBe(true);
		expect(tag.style.has('font-size')).toBe(true);
		expect(tag.style.get('color')).toBe('red');
		expect(tag.style.get('font-size')).toBe('12px');
		expect(tag.style.toString()).toBe('color: red; font-size: 12px;');
		expect(tag.html).toBe('<div class="tag2a tag2b" style="color: red; font-size: 12px;" id="tag1"></div>');

		tag.style.remove('color');
		expect(tag.style.size).toBe(1);
		expect(tag.style.has('color')).toBe(false);
		expect(tag.style.has('font-size')).toBe(true);
		expect(tag.style.get('color')).toBeUndefined();
		expect(tag.style.get('font-size')).toBe('12px');
		expect(tag.style.toString()).toBe('font-size: 12px;');
		expect(tag.html).toBe('<div class="tag2a tag2b" style="font-size: 12px;" id="tag1"></div>');

		tag.style = new TagStyle({color: 'blue'});
		expect(tag.style.size).toBe(1);
		expect(tag.style.has('color')).toBe(true);
		expect(tag.style.has('font-size')).toBe(false);
		expect(tag.style.get('color')).toBe('blue');
		expect(tag.style.get('font-size')).toBeUndefined();
		expect(tag.style.toString()).toBe('color: blue;');
		expect(tag.html).toBe('<div class="tag2a tag2b" style="color: blue;" id="tag1"></div>');

		tag.style.clear();
		expect(tag.style.size).toBe(0);
		expect(tag.style.has('color')).toBe(false);
		expect(tag.style.has('font-size')).toBe(false);
		expect(tag.style.get('color')).toBeUndefined();
		expect(tag.style.get('font-size')).toBeUndefined();
		expect(tag.style.toString()).toBe('');
		expect(tag.html).toBe('<div class="tag2a tag2b" id="tag1"></div>');

		tag.style = new TagStyle('color: green; font-size: 16px;');
		expect(tag.style.size).toBe(2);
		expect(tag.style.has('color')).toBe(true);
		expect(tag.style.has('font-size')).toBe(true);
		expect(tag.style.get('color')).toBe('green');
		expect(tag.style.get('font-size')).toBe('16px');
		expect(tag.style.toString()).toBe('color: green; font-size: 16px;');
		expect(tag.html).toBe('<div class="tag2a tag2b" style="color: green; font-size: 16px;" id="tag1"></div>');

		const map = new Map<string, string>();
		map.set('color', 'yellow');
		map.set('font-size', '20px');
		tag.style = new TagStyle(map);
		expect(tag.style.size).toBe(2);
		expect(tag.style.has('color')).toBe(true);
		expect(tag.style.has('font-size')).toBe(true);
		expect(tag.style.get('color')).toBe('yellow');
		expect(tag.style.get('font-size')).toBe('20px');
		expect(tag.style.toString()).toBe('color: yellow; font-size: 20px;');
		expect(tag.html).toBe('<div class="tag2a tag2b" style="color: yellow; font-size: 20px;" id="tag1"></div>');
	});
	
	test('Attributes can be set properly', () => {
		const tag1 = new Tag('a', {href: 'https://example.com', class: ['tag1a', 'tag1b'], autofocus: true});
		expect(tag1).toBeInstanceOf(Tag);
		expect(tag1.tag).toBe('a');
		expect(tag1.isVoid).toBe(false);
		expect(tag1.attributes.href).toBe('https://example.com');
		expect(tag1.attributes.autofocus).toBe(true);
		expect(tag1.class.toString()).toBe('tag1a tag1b');
		expect(tag1.children).toBeInstanceOf(Array);
		expect(tag1.children.length).toBe(0);
		expect(tag1.htmlAttributes).toBe(' class="tag1a tag1b" href="https://example.com" autofocus');
		expect(tag1.html).toBe('<a class="tag1a tag1b" href="https://example.com" autofocus></a>');

		tag1.attributes.href = '#';
		expect(tag1.attributes.href).toBe('#');
		expect(tag1.htmlAttributes).toBe(' class="tag1a tag1b" href="#" autofocus');
		expect(tag1.html).toBe('<a class="tag1a tag1b" href="#" autofocus></a>');

		delete tag1.attributes.autofocus;
		tag1.attributes.class = 'tag1c tag1d';
		expect(tag1.attributes.autofocus).toBeUndefined();
		expect(tag1.class.size).toBe(2);
		expect(tag1.class.has('tag1a')).toBe(false);
		expect(tag1.class.has('tag1b')).toBe(false);
		expect(tag1.class.has('tag1c')).toBe(true);
		expect(tag1.class.has('tag1d')).toBe(true);
		expect(tag1.class.toString()).toBe('tag1c tag1d');
		expect(tag1.attributes.class).toBe('tag1c tag1d');
		expect(tag1.htmlAttributes).toBe(' class="tag1c tag1d" href="#"');
		expect(tag1.html).toBe('<a class="tag1c tag1d" href="#"></a>');

		tag1.attributes.style = 'color: red; font-size: 12px;';
		expect(tag1.style.size).toBe(2);
		expect(tag1.style.has('color')).toBe(true);
		expect(tag1.style.has('font-size')).toBe(true);
		expect(tag1.style.get('color')).toBe('red');
		expect(tag1.style.get('font-size')).toBe('12px');
		expect(tag1.style.toString()).toBe('color: red; font-size: 12px;');
		expect(tag1.attributes.style).toBe('color: red; font-size: 12px;');
		expect(tag1.htmlAttributes).toBe(' class="tag1c tag1d" style="color: red; font-size: 12px;" href="#"');
		expect(tag1.html).toBe('<a class="tag1c tag1d" style="color: red; font-size: 12px;" href="#"></a>');
	});

	test('Tag can be created with children', () => {
		const tag1 = new Tag('div', {}, [
			$.h1('Hello, world!'),
			raw`<p>Test</p>`,
			comment`Comment`,
			() => $.a({href: '#'}, 'Link')
		]);
		expect(tag1).toBeInstanceOf(Tag);
		expect(tag1.tag).toBe('div');
		expect(tag1.isVoid).toBe(false);
		expect(tag1.children).toBeInstanceOf(Array);
		expect(tag1.children.length).toBe(4);
		expect(tag1.children[0]).toBeInstanceOf(Tag);
		expect((tag1.children[0] as Tag<'h1'>).tag).toBe('h1');
		expect((tag1.children[0] as Tag<'h1'>).isVoid).toBe(false);
		expect((tag1.children[0] as Tag<'h1'>).children).toBeInstanceOf(Array);
		expect((tag1.children[0] as Tag<'h1'>).children.length).toBe(1);
		expect((tag1.children[0] as Tag<'h1'>).children[0]).toBe('Hello, world!');
		expect(tag1.children[1]).toBeInstanceOf(RawContent);
		expect((tag1.children[1] as RawContent).toString()).toBe('<p>Test</p>');
		expect(tag1.children[2]).toBeInstanceOf(RawContent);
		expect((tag1.children[2] as RawContent).toString()).toBe('<!-- Comment -->');
		expect(tag1.children[3]).toBeInstanceOf(Tag);
		expect((tag1.children[3] as Tag<'a'>).tag).toBe('a');
		expect((tag1.children[3] as Tag<'a'>).isVoid).toBe(false);
		expect((tag1.children[3] as Tag<'a'>).attributes.href).toBe('#');
		expect((tag1.children[3] as Tag<'a'>).children).toBeInstanceOf(Array);
		expect((tag1.children[3] as Tag<'a'>).children.length).toBe(1);
		expect((tag1.children[3] as Tag<'a'>).children[0]).toBe('Link');
		expect(tag1.html).toBe('<div><h1>Hello, world!</h1><p>Test</p><!-- Comment --><a href="#">Link</a></div>');
	});

	test('Tag outer content is handled properly', () => {
		const tag1 = new Tag();
		expect(tag1.outerContent.before).toBeNull();
		expect(tag1.outerContent.after).toBeNull();
		expect(tag1.html).toBe('<div></div>');

		tag1.outerContent.before = comment`Before`;
		tag1.outerContent.after = comment`After`;
		expect(tag1.outerContent.before).toBeInstanceOf(RawContent);
		expect(tag1.outerContent.before.toString()).toBe('<!-- Before -->');
		expect(tag1.outerContent.after).toBeInstanceOf(RawContent);
		expect(tag1.outerContent.after.toString()).toBe('<!-- After -->');
		expect(tag1.html).toBe('<!-- Before --><div></div><!-- After -->');

		tag1.outerContent.before = 'Before <>';
		tag1.outerContent.after = 'After <>';
		expect(typeof tag1.outerContent.before).toBe('string');
		expect(tag1.outerContent.before).toBe('Before <>');
		expect(typeof tag1.outerContent.after).toBe('string');
		expect(tag1.outerContent.after).toBe('After <>');
		expect(tag1.html).toBe('Before &lt;&gt;<div></div>After &lt;&gt;');
	});
});

describe('Tag cloning', () => {
	const tag = new Tag('div', {id: 'tag1', class: ['tag1a', 'tag1b'], style: {background: '#000'}}, [
		$.a({href: '#'}, 'Link')
	]);
	
	test('Tag can be cloned properly', () => {
		const tag1 = tag.clone();
		expect(tag1).toBeInstanceOf(Tag);
		expect(tag1).not.toBe(tag);
		expect(tag1.tag).toBe('div');
		expect(tag1.isVoid).toBe(false);
		expect(tag1.class).toBeInstanceOf(TagClass);
		expect(tag1.style).toBeInstanceOf(TagStyle);
		expect(typeof tag1.attributes).toBe('object');
		expect(tag1.class).not.toBe(tag.class);
		expect(tag1.style).not.toBe(tag.style);
		expect(tag1.attributes).not.toBe(tag.attributes);
		expect(tag1.children).toBeInstanceOf(Array);
		expect(tag1.children.length).toBe(0);
		expect(tag1.class.size).toBe(2);
		expect(tag1.style.size).toBe(1);
		expect(tag1.class.has('tag1a')).toBe(true);
		expect(tag1.class.has('tag1b')).toBe(true);
		expect(tag1.style.has('background')).toBe(true);
		expect(tag1.style.get('background')).toBe('#000');
		expect(tag1.style.toString()).toBe('background: #000;');
		expect(tag1.html).toBe('<div class="tag1a tag1b" style="background: #000;" id="tag1"></div>');
	});

	test('Tag can be deep cloned properly', () => {
		const tag2 = tag.clone(true);
		expect(tag2).toBeInstanceOf(Tag);
		expect(tag2).not.toBe(tag);
		expect(tag2.tag).toBe('div');
		expect(tag2.isVoid).toBe(false);
		expect(tag2.class).toBeInstanceOf(TagClass);
		expect(tag2.style).toBeInstanceOf(TagStyle);
		expect(typeof tag2.attributes).toBe('object');
		expect(tag2.class).not.toBe(tag.class);
		expect(tag2.style).not.toBe(tag.style);
		expect(tag2.attributes).not.toBe(tag.attributes);
		expect(tag2.class.size).toBe(2);
		expect(tag2.class.has('tag1a')).toBe(true);
		expect(tag2.class.has('tag1b')).toBe(true);
		expect(tag2.style.size).toBe(1);
		expect(tag2.style.has('background')).toBe(true);
		expect(tag2.style.get('background')).toBe('#000');
		expect(tag2.style.toString()).toBe('background: #000;');
		expect(tag2.children).toBeInstanceOf(Array);
		expect(tag2.children).not.toBe(tag.children);
		expect(tag2.children.length).toBe(1);
		expect(tag2.children[0]).toBeInstanceOf(Tag);
		expect(tag2.children[0]).not.toBe(tag.children[0]);
		expect((tag2.children[0] as Tag<'a'>).tag).toBe('a');
		expect((tag2.children[0] as Tag<'a'>).isVoid).toBe(false);
		expect((tag2.children[0] as Tag<'a'>).attributes.href).toBe('#');
		expect((tag2.children[0] as Tag<'a'>).children).toBeInstanceOf(Array);
		expect((tag2.children[0] as Tag<'a'>).children.length).toBe(1);
		expect((tag2.children[0] as Tag<'a'>).children[0]).toBe('Link');
		expect(tag2.html).toBe('<div class="tag1a tag1b" style="background: #000;" id="tag1"><a href="#">Link</a></div>');
	});
});

describe('Selector creation and manipulation', () => {
	test('Basic div selector is created properly', () => {
		const tag = new Tag('div');
		expect(tag.selector).toBeInstanceOf(Selector);
		expect(tag.selector.class).toBeInstanceOf(TagClass);
		expect(tag.selector.class.size).toBe(0);
		expect(tag.selector.id).toBeUndefined();
		expect(tag.selector.toString()).toBe('div');
		expect(tag.html).toBe('<div></div>');
	});

	test('Selector properties are handled properly', () => {
		const tag = new Tag('#tag1.tag1a.tag1b');
		expect(tag.selector).toBeInstanceOf(Selector);
		expect(tag.selector.id).toBe('tag1');
		expect(tag.selector.class).toBeInstanceOf(TagClass);
		expect(tag.selector.class.size).toBe(2);
		expect(tag.selector.class.has('tag1a')).toBe(true);
		expect(tag.selector.class.has('tag1b')).toBe(true);
		expect(tag.selector.class.has('tag1c')).toBe(false);
		expect(tag.selector.toString()).toBe('#tag1.tag1a.tag1b');
		expect(tag.selector.tag).toBe('');
		expect(tag.tag).toBe('div');
		expect(tag.html).toBe('<div class="tag1a tag1b" id="tag1"></div>');

		tag.selector.id = 'tag2';
		expect(tag.selector.id).toBe('tag2');
		expect(tag.selector.toString()).toBe('#tag2.tag1a.tag1b');
		expect(tag.html).toBe('<div class="tag1a tag1b" id="tag2"></div>');

		tag.selector.class.remove('tag1a');
		expect(tag.selector.class.size).toBe(1);
		expect(tag.selector.class.has('tag1a')).toBe(false);
		expect(tag.selector.class.has('tag1b')).toBe(true);
		expect(tag.selector.toString()).toBe('#tag2.tag1b');
		expect(tag.html).toBe('<div class="tag1b" id="tag2"></div>');

		tag.selector.class.add('tag1c');
		expect(tag.selector.class.size).toBe(2);
		expect(tag.selector.class.has('tag1a')).toBe(false);
		expect(tag.selector.class.has('tag1b')).toBe(true);
		expect(tag.selector.class.has('tag1c')).toBe(true);
		expect(tag.selector.toString()).toBe('#tag2.tag1b.tag1c');
		expect(tag.html).toBe('<div class="tag1b tag1c" id="tag2"></div>');

		tag.selector.class.clear();
		expect(tag.selector.class.size).toBe(0);
		expect(tag.selector.toString()).toBe('#tag2');
		expect(tag.html).toBe('<div id="tag2"></div>');

		tag.selector.class = new TagClass(['tag2a', 'tag2b']);
		expect(tag.selector.class.size).toBe(2);
		expect(tag.selector.class.has('tag2a')).toBe(true);
		expect(tag.selector.class.has('tag2b')).toBe(true);
		expect(tag.selector.toString()).toBe('#tag2.tag2a.tag2b');
		expect(tag.html).toBe('<div class="tag2a tag2b" id="tag2"></div>');

		tag.class = new TagClass(['tag3a', 'tag3b']);
		expect(tag.selector.class.size).toBe(2);
		expect(tag.selector.class.has('tag2a')).toBe(false);
		expect(tag.selector.class.has('tag2b')).toBe(false);
		expect(tag.selector.class.has('tag3a')).toBe(true);
		expect(tag.selector.class.has('tag3b')).toBe(true);
		expect(tag.selector.toString()).toBe('#tag2.tag3a.tag3b');
		expect(tag.html).toBe('<div class="tag3a tag3b" id="tag2"></div>');
		expect(tag.class).toBe(tag.selector.class);
	});

	test('Empty selector is handled properly', () => {
		const tag = new Tag('');
		expect(tag.selector).toBeInstanceOf(Selector);
		expect(tag.selector.class).toBeInstanceOf(TagClass);
		expect(tag.selector.class.size).toBe(0);
		expect(tag.selector.id).toBeUndefined();
		expect(tag.selector.toString()).toBe('');
		expect(tag.html).toBe('<div></div>');

		const selector = new Selector();
		expect(selector).toBeInstanceOf(Selector);
		expect(selector.class).toBeInstanceOf(TagClass);
		expect(selector.class.size).toBe(0);
		expect(selector.id).toBeUndefined();
		expect(selector.toString()).toBe('');
	});
		
	test('Selector can be set with a tag name', () => {
		const tag1 = new Tag('p');
		expect(tag1.selector).toBeInstanceOf(Selector);
		expect(tag1.selector.class).toBeInstanceOf(TagClass);
		expect(tag1.selector.class.size).toBe(0);
		expect(tag1.selector.id).toBeUndefined();
		expect(tag1.selector.toString()).toBe('p');
		expect(tag1.html).toBe('<p></p>');

		const tag2 = new Tag('p#tag1');
		expect(tag2.selector).toBeInstanceOf(Selector);
		expect(tag2.selector.class).toBeInstanceOf(TagClass);
		expect(tag2.selector.class.size).toBe(0);
		expect(tag2.selector.id).toBe('tag1');
		expect(tag2.selector.toString()).toBe('p#tag1');
		expect(tag2.html).toBe('<p id="tag1"></p>');

		const tag3 = new Tag('p.tag1');
		expect(tag3.selector).toBeInstanceOf(Selector);
		expect(tag3.selector.class).toBeInstanceOf(TagClass);
		expect(tag3.selector.class.size).toBe(1);
		expect(tag3.selector.id).toBeUndefined();
		expect(tag3.selector.toString()).toBe('p.tag1');
		expect(tag3.html).toBe('<p class="tag1"></p>');

		const tag4 = new Tag('p#tag1.tag1a.tag1b');
		expect(tag4.selector).toBeInstanceOf(Selector);
		expect(tag4.selector.class).toBeInstanceOf(TagClass);
		expect(tag4.selector.class.size).toBe(2);
		expect(tag4.selector.id).toBe('tag1');
		expect(tag4.selector.toString()).toBe('p#tag1.tag1a.tag1b');
		expect(tag4.html).toBe('<p class="tag1a tag1b" id="tag1"></p>');
	});
});
