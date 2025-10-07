import {describe, expect, test} from '@jest/globals';
import {$, RawContent, RootTemplate, Template, comment, loop, raw} from 'whits';
import {Attributes} from '../../dist/tag/tag.js';

describe('Root template creation and rendering', () => {
	test('Static root template is created and rendered properly', async () => {
		const template = new RootTemplate([
			$.head([$.title('Test')]),
			$.body([$.h1('Hello, world!')])
		]);
		expect(template).toBeInstanceOf(Template);
		expect(template).toBeInstanceOf(RootTemplate);
		expect(template.doctype).toBe('<!doctype html>');
		expect(await template.renderString()).toBe('<!doctype html>\n<html lang="en"><head><title>Test</title></head><body><h1>Hello, world!</h1></body></html>');
	});

	test('Dynamic root template is created and rendered properly', async () => {
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
		expect(template.doctype).toBe('<!doctype html>');

		const rendered = await template.render({x: 5, y: 'Hello, world!', z: ['a', 'b', 'c']});
		expect(rendered).toBeInstanceOf(RawContent);
		expect(rendered.toString()).toBe(
			'<!doctype html>\n' +
			'<html lang="en"><head><title>Test</title></head><body>' +
			'<div id="container"><h1>Hello, world!</h1>' +
			'<div class="item">a</div><div class="item">b</div><div class="item">c</div>' +
			'<ul><li>Item 0</li><li>Item 1</li><li>Item 2</li><li>Item 3</li><li>Item 4</li></ul>' +
			'</div>Escaped text &lt;&gt;<!-- Comment 1 --><!-- Comment 2 --></body></html>'
		);
	});

	test('Root template doctype can be changed', async () => {
		const template = new RootTemplate([
			$.head([$.title('Test')]),
			$.body([$.h1('Hello, world!')])
		], '<!doctype html5>');
		expect(template).toBeInstanceOf(Template);
		expect(template).toBeInstanceOf(RootTemplate);
		expect(template.doctype).toBe('<!doctype html5>');
		expect(await template.renderString()).toBe('<!doctype html5>\n<html lang="en"><head><title>Test</title></head><body><h1>Hello, world!</h1></body></html>');
	});

	test('Root template doctype can be disabled', async () => {
		const template = new RootTemplate([
			$.head([$.title('Test')]),
			$.body([$.h1('Hello, world!')])
		], null);
		expect(template).toBeInstanceOf(Template);
		expect(template).toBeInstanceOf(RootTemplate);
		expect(template.doctype).toBeNull();
		expect(await template.renderString()).toBe('<html lang="en"><head><title>Test</title></head><body><h1>Hello, world!</h1></body></html>');
	});

	test('Root template root tag can be changed', async () => {
		const template = new RootTemplate([
			$.head([$.title('Test')]),
			$.body([$.h1('Hello, world!')])
		], null, 'body');
		expect(template).toBeInstanceOf(Template);
		expect(template).toBeInstanceOf(RootTemplate);
		expect(template.doctype).toBeNull();
		expect(await template.renderString()).toBe('<body><head><title>Test</title></head><body><h1>Hello, world!</h1></body></body>');
	});

	test('Root template root tag can be set dynamically', async () => {
		const template1 = new RootTemplate<{attributes?: Partial<Attributes<'html'>>, title: string}>((params) => [
			$.head([$.title(params.title)]),
			$.body([$.h1('Hello, world!')])
		], undefined, (params, content) => $.html(params.attributes, content));
		expect(template1).toBeInstanceOf(Template);
		expect(template1).toBeInstanceOf(RootTemplate);
		expect(template1.doctype).toBe('<!doctype html>');
		expect(await template1.renderString({attributes: {id: 'foo', class: 'bar'}, title: 'test'})).toBe('<!doctype html>\n<html class="bar" id="foo"><head><title>test</title></head><body><h1>Hello, world!</h1></body></html>');
		expect(await template1.renderString({title: 'test'})).toBe('<!doctype html>\n<html><head><title>test</title></head><body><h1>Hello, world!</h1></body></html>');

		const template2 = new RootTemplate<{htmlClass: string}>((params) => [
			$.head([$.title(params.htmlClass)]),
			$.body([$.h1('Hello, world!')])
		], undefined, (params, content) => $(`html.${params.htmlClass}`)(content));
		expect(template2).toBeInstanceOf(Template);
		expect(template2).toBeInstanceOf(RootTemplate);
		expect(template2.doctype).toBe('<!doctype html>');
		expect(await template2.renderString({htmlClass: 'test'})).toBe('<!doctype html>\n<html class="test"><head><title>test</title></head><body><h1>Hello, world!</h1></body></html>');
	});

	test('Root template root tag attributes can be changed', async () => {
		const template1 = new RootTemplate([
			$.head([$.title('Test')]),
			$.body([$.h1('Hello, world!')])
		], null, 'body', {title: 'foo', class: 'bar'});
		expect(template1).toBeInstanceOf(Template);
		expect(template1).toBeInstanceOf(RootTemplate);
		expect(template1.doctype).toBeNull();
		expect(await template1.renderString()).toBe('<body class="bar" title="foo"><head><title>Test</title></head><body><h1>Hello, world!</h1></body></body>');
		
		const template2 = new RootTemplate([
			$.head([$.title('Test')]),
			$.body([$.h1('Hello, world!')])
		], null, 'html', {title: 'foo', class: 'bar'});
		expect(template2).toBeInstanceOf(Template);
		expect(template2).toBeInstanceOf(RootTemplate);
		expect(template2.doctype).toBeNull();
		expect(await template2.renderString()).toBe('<html class="bar" title="foo"><head><title>Test</title></head><body><h1>Hello, world!</h1></body></html>');
		
		const template3 = new RootTemplate([
			$.head([$.title('Test')]),
			$.body([$.h1('Hello, world!')])
		], null, 'html', {lang: 'en'});
		expect(template3).toBeInstanceOf(Template);
		expect(template3).toBeInstanceOf(RootTemplate);
		expect(template3.doctype).toBeNull();
		expect(await template3.renderString()).toBe('<html lang="en"><head><title>Test</title></head><body><h1>Hello, world!</h1></body></html>');
		
		const template4 = new RootTemplate([
			$.head([$.title('Test')]),
			$.body([$.h1('Hello, world!')])
		], undefined, 'html', {});
		expect(template4).toBeInstanceOf(Template);
		expect(template4).toBeInstanceOf(RootTemplate);
		expect(template4.doctype).toBe('<!doctype html>');
		expect(await template4.renderString()).toBe('<!doctype html>\n<html><head><title>Test</title></head><body><h1>Hello, world!</h1></body></html>');
		
		const template5 = new RootTemplate([
			$.head([$.title('Test')]),
			$.body([$.h1('Hello, world!')])
		], null, 'html', {title: 'foo', class: 'bar'});
		template5.rootAttributes.title = 'baz';
		template5.rootAttributes.lang = 'fr';
		expect(template5).toBeInstanceOf(Template);
		expect(template5).toBeInstanceOf(RootTemplate);
		expect(template5.doctype).toBeNull();
		expect(await template5.renderString()).toBe('<html class="bar" title="baz" lang="fr"><head><title>Test</title></head><body><h1>Hello, world!</h1></body></html>');

		template5.rootAttributes = {id: 'foo'};
		expect(await template5.renderString()).toBe('<html id="foo"><head><title>Test</title></head><body><h1>Hello, world!</h1></body></html>');
	});
});

describe('Template creation and rendering', () => {
	test('Static template is created and rendered properly', async () => {
		const template = new Template([
			$('#test')('Hello, world!')
		]);
		expect(template).toBeInstanceOf(Template);
		expect(template).not.toBeInstanceOf(RootTemplate);
		expect(await template.renderString()).toBe('<div id="test">Hello, world!</div>');
	});

	test('Dynamic template is created and rendered properly', async () => {
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

		const rendered = await template.render({x: 5, y: 'Hello, world!', z: ['a', 'b', 'c']});
		expect(rendered).toBeInstanceOf(RawContent);
		expect(rendered.toString()).toBe(
			'<div id="container"><h1>Hello, world!</h1>' +
			'<div class="item">a</div><div class="item">b</div><div class="item">c</div>' +
			'<ul><li>Item 0</li><li>Item 1</li><li>Item 2</li><li>Item 3</li><li>Item 4</li></ul>' +
			'</div>Escaped text &lt;&gt;<!-- Comment 1 --><!-- Comment 2 -->'
		);
	});

	test('Template can be rendered with no children', async () => {
		const template1 = new Template(null);
		expect(template1).toBeInstanceOf(Template);
		expect(template1).not.toBeInstanceOf(RootTemplate);
		expect(await template1.renderString()).toBe('');

		const template2 = new Template([]);
		expect(template2).toBeInstanceOf(Template);
		expect(template2).not.toBeInstanceOf(RootTemplate);
		expect(await template2.renderString()).toBe('');
	});
});
