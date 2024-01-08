import {$, Template} from 'whits';
import {TemplateParams} from './htmlTemplate.js';

const bullets = [
	'One',
	'Two',
	'Three'
];

export default new Template<TemplateParams>(({pageId}) => $('section.block2')([
	$.h2('Block 2'),
	$.p(`This is a "block2" component, included from ${pageId}.`),
	$.p('It contains a list of bullets:'),
	$.ul(bullets.map((bullet) => $.li(bullet)))
]));
