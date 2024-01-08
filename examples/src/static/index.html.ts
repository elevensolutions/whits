import {$, Template} from 'whits';
import htmlTemplate from './components/htmlTemplate.js';
import block1 from './components/block1.js';
import block2 from './components/block2.js';

export default htmlTemplate.render({
	title: 'Static Example',
	pageId: 'index',
	pageTemplate: new Template((params) => [
		$.p('This is the index page.'),
		$.p('It includes "block1" and "block2" components:'),
		block1.render(params),
		block2.render(params)
	])
});
