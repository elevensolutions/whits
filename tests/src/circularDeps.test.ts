import {describe, expect, test} from '@jest/globals';
import type {MatcherFunction} from 'expect';
import madge, {MadgeInstance} from 'madge';
import {resolve} from 'path';

declare module 'expect' {
	interface Matchers<R> {
		toHaveNoCircularDeps(): R
	}
}

const toHaveNoCircularDeps: MatcherFunction = function(received: MadgeInstance) {
	if (!('circular' in received)) throw new Error('Not a Madge instance');
	const deps = received.circular();
	const {printExpected, printReceived, RECEIVED_COLOR} = this.utils;
	return {
		message: () => [
			`Expected dependency loops: ${printExpected(0)}`,
			`Received dependency loops: ${printReceived(deps.length)}`,
			deps.map((loop) => `↺ ${RECEIVED_COLOR(loop.join(' ⇒ '))}`).join('\n')
		].join('\n'),
		pass: !deps.length
	};
};

expect.extend({toHaveNoCircularDeps});

describe('Circular Dependencies', () => {
	test('Free of circular dependencies', async () => {
		const result = await madge(resolve('dist'));
		expect(result).toHaveNoCircularDeps();
	});
});
