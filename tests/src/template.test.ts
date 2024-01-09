import {describe, expect, test} from '@jest/globals';
import {$, RawContent, RootTemplate, Template, comment, loop, raw} from 'whits';

describe('Root template creation and rendering', () => {
	test('Static root template is created and rendered properly', () => {
		const template = new RootTemplate([
			$.head([$.title('Test')]),
			$.body([$.h1('Hello, world!')])
		]);
		expect(template).toBeInstanceOf(Template);
		expect(template).toBeInstanceOf(RootTemplate);
		expect(template.doctype).toBe('<!DOCTYPE html>');
		expect(template.renderString()).toBe('<!DOCTYPE html>\n<html><head><title>Test</title></head><body><h1>Hello, world!</h1></body></html>');
	});

	test('Dynamic root template is created and rendered properly', () => {
		const template = new RootTemplate<{x: number, y: string, z: string[]}>((params) => [
			$.head([$.title('Test')]),
			$.body([
				$('#container')([
					$.h1(params.y),
					...params.z.map((item) => $('.item')(item)),
					$.ul(loop(params.x, (i) => $.li('Item ' + i)))
				]),
				'Escaped text <>',
				raw`<!-- Comment 1 -->`,
				comment`Comment 2`,
			])
		]);
		expect(template).toBeInstanceOf(Template);
		expect(template).toBeInstanceOf(RootTemplate);
		expect(template.doctype).toBe('<!DOCTYPE html>');

		const rendered = template.render({x: 5, y: 'Hello, world!', z: ['a', 'b', 'c']});
		expect(rendered).toBeInstanceOf(RawContent);
		expect(rendered.toString()).toBe(
			'<!DOCTYPE html>\n' +
			'<html><head><title>Test</title></head><body>' +
			'<div id="container"><h1>Hello, world!</h1>' +
			'<div class="item">a</div><div class="item">b</div><div class="item">c</div>' +
			'<ul><li>Item 0</li><li>Item 1</li><li>Item 2</li><li>Item 3</li><li>Item 4</li></ul>' +
			'</div>Escaped text &lt;&gt;<!-- Comment 1 --><!-- Comment 2 --></body></html>'
		);
	});

	test('Root template doctype can be changed', () => {
		const template = new RootTemplate([
			$.head([$.title('Test')]),
			$.body([$.h1('Hello, world!')])
		], '<!DOCTYPE html5>');
		expect(template).toBeInstanceOf(Template);
		expect(template).toBeInstanceOf(RootTemplate);
		expect(template.doctype).toBe('<!DOCTYPE html5>');
		expect(template.renderString()).toBe('<!DOCTYPE html5>\n<html><head><title>Test</title></head><body><h1>Hello, world!</h1></body></html>');
	});

	test('Root template doctype can be disabled', () => {
		const template = new RootTemplate([
			$.head([$.title('Test')]),
			$.body([$.h1('Hello, world!')])
		], null);
		expect(template).toBeInstanceOf(Template);
		expect(template).toBeInstanceOf(RootTemplate);
		expect(template.doctype).toBeNull();
		expect(template.renderString()).toBe('<html><head><title>Test</title></head><body><h1>Hello, world!</h1></body></html>');
	});

	test('Root template root tag can be changed', () => {
		const template = new RootTemplate([
			$.head([$.title('Test')]),
			$.body([$.h1('Hello, world!')])
		], null, 'body');
		expect(template).toBeInstanceOf(Template);
		expect(template).toBeInstanceOf(RootTemplate);
		expect(template.doctype).toBeNull();
		expect(template.renderString()).toBe('<body><head><title>Test</title></head><body><h1>Hello, world!</h1></body></body>');
	});

	test('Root template root tag can be set dynamically', () => {
		const template1 = new RootTemplate<{htmlClass: string}>((params) => [
			$.head([$.title(params.htmlClass)]),
			$.body([$.h1('Hello, world!')])
		], undefined, (params, content) => $.html({class: params.htmlClass}, content));
		expect(template1).toBeInstanceOf(Template);
		expect(template1).toBeInstanceOf(RootTemplate);
		expect(template1.doctype).toBe('<!DOCTYPE html>');
		expect(template1.renderString({htmlClass: 'test'})).toBe('<!DOCTYPE html>\n<html class="test"><head><title>test</title></head><body><h1>Hello, world!</h1></body></html>');

		const template2 = new RootTemplate<{htmlClass: string}>((params) => [
			$.head([$.title(params.htmlClass)]),
			$.body([$.h1('Hello, world!')])
		], undefined, (params, content) => $(`html.${params.htmlClass}`)(content));
		expect(template2).toBeInstanceOf(Template);
		expect(template2).toBeInstanceOf(RootTemplate);
		expect(template2.doctype).toBe('<!DOCTYPE html>');
		expect(template2.renderString({htmlClass: 'test'})).toBe('<!DOCTYPE html>\n<html class="test"><head><title>test</title></head><body><h1>Hello, world!</h1></body></html>');
	});
});

describe('Template creation and rendering', () => {
	test('Static template is created and rendered properly', () => {
		const template = new Template([
			$('#test')('Hello, world!')
		]);
		expect(template).toBeInstanceOf(Template);
		expect(template).not.toBeInstanceOf(RootTemplate);
		expect(template.renderString()).toBe('<div id="test">Hello, world!</div>');
	});

	test('Dynamic template is created and rendered properly', () => {
		const template = new Template<{x: number, y: string, z: string[]}>((params) => [
			$('#container')([
				$.h1(params.y),
				...params.z.map((item) => $('.item')(item)),
				$.ul(loop(params.x, (i) => $.li('Item ' + i)))
			]),
			'Escaped text <>',
			raw`<!-- Comment 1 -->`,
			comment`Comment 2`,
		]);
		expect(template).toBeInstanceOf(Template);
		expect(template).not.toBeInstanceOf(RootTemplate);

		const rendered = template.render({x: 5, y: 'Hello, world!', z: ['a', 'b', 'c']});
		expect(rendered).toBeInstanceOf(RawContent);
		expect(rendered.toString()).toBe(
			'<div id="container"><h1>Hello, world!</h1>' +
			'<div class="item">a</div><div class="item">b</div><div class="item">c</div>' +
			'<ul><li>Item 0</li><li>Item 1</li><li>Item 2</li><li>Item 3</li><li>Item 4</li></ul>' +
			'</div>Escaped text &lt;&gt;<!-- Comment 1 --><!-- Comment 2 -->'
		);
	});

	test('Template can be rendered with no children', () => {
		const template1 = new Template(null);
		expect(template1).toBeInstanceOf(Template);
		expect(template1).not.toBeInstanceOf(RootTemplate);
		expect(template1.renderString()).toBe('');

		const template2 = new Template([]);
		expect(template2).toBeInstanceOf(Template);
		expect(template2).not.toBeInstanceOf(RootTemplate);
		expect(template2.renderString()).toBe('');
	});
});
