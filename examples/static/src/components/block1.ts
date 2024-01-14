import {$, Template} from 'whits';
import {TemplateParams} from './htmlTemplate.js';

export default new Template<TemplateParams>(({pageId}) => $('section.block1')([
	$.h2('Block 1'),
	$.p(`This is a "block1" component, included from ${pageId}.`)
]));
