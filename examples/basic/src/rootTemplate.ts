import {$, RootTemplate} from 'whits';
import containerTemplate from './containerTemplate.js';

export default new RootTemplate([
	$.head([
		$.meta({name: 'viewport', content: 'width=device-width, initial-scale=1'}),
		$.title('Basic Example')
	]),
	$.body([
		$.header([$.h1('Header')]),
		containerTemplate.render({liItems: 5, heading: 'Basic Example', divItems: ['Item A', 'Item B', 'Item C']}),
	])
]);
