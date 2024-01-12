import {extend} from 'whits';

declare module 'whits' {
	interface HtmlAttributeOverrides {
		foo: 'bar' | 'baz';
		boo: 'far' | 'faz';
		div: 'bad-attr';
	}
	interface SvgAttributeOverrides {
		bar: undefined;
	}
}

extend('foo', 'boo', 'bar');
