import {readFileSync, writeFileSync} from 'fs';

const {pct} = JSON.parse(readFileSync('coverage/coverage-summary.json')).total.lines;

writeFileSync('coverage/badge.json', JSON.stringify({
	schemaVersion: 1,
	label: 'coverage',
	message: `${Math.round(pct)}%`,
	color: pct < 80 ? 'red' : pct < 90 ? 'yellow' : 'brightgreen',
	namedLogo: 'jest'
}));
