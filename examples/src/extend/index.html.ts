import {$, RootTemplate} from 'whits';

export default new RootTemplate([
	$.foo({bar: true, baz: 'boo'}, [
		$.boo({far: true, faz: 'bar'}, 'baz'),
	]),
	$.svg([
		$.bar('Only in SVG')
	])
]);
