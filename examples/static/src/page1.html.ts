import {$, Template} from 'whits';
import htmlTemplate from './components/htmlTemplate.js';
import block1 from './components/block1.js';

export default htmlTemplate.render({
	title: 'Static Example Page 1',
	pageId: 'page1',
	pageTemplate: new Template((params) => [
		$.p('This is page 1.'),
		$.p('It includes a "block1" component:'),
		block1.render(params)
	])
});
