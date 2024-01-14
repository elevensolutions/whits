import {$, Template} from 'whits';
import type {TemplateParams} from './htmlTemplate.js';

function navItem(id: string, label: string, activeId: string) {
	return $.li([$.a({href: `${id}.html`, class: id === activeId && 'active'}, label)]);
}

export default new Template<TemplateParams>((params) => (
	$.header([
		$.h1(params.title),
		$.nav([
			$.ul([
				navItem('index', 'Home', params.pageId),
				navItem('page1', 'Page 1', params.pageId),
				navItem('page2', 'Page 2', params.pageId)
			])
		])
	])
));
