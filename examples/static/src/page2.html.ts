import {$, Template} from 'whits';
import htmlTemplate from './components/htmlTemplate.js';
import block2 from './components/block2.js';

export default htmlTemplate.render({
	title: 'Static Example Page 2',
	pageId: 'page2',
	pageTemplate: new Template(async (params) => [
		$.p('This is page 2.'),
		$.p('It includes a "block2" component:'),
		await block2.render(params)
	])
});
