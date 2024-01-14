import {createServer} from 'http';
import rootTemplate from './rootTemplate.js';

const server = createServer((req, res) => {
	if (req.method === 'GET' && req.url === '/') {
		const time = process.hrtime();
		res.end(rootTemplate.render().toString(), () => {
			const [sec, nsec] = process.hrtime(time);
			console.log(`Rendered in ${sec}sec, ${nsec / 1000000}ms`);
		});
	} else {
		res.statusCode = 404;
		res.end('Not Found');
	}
});

server.listen(8080);
