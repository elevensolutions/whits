import {$, RootTemplate} from 'whits';

export default new RootTemplate([
	$.foo({bar: true, baz: 'boo'}, [
		$('boo#boo')('baz'),
		$.div({"bad-attr": true})
	])
]);
