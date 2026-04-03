import {describe, expect, test} from '@jest/globals';
import type {MatcherFunction} from 'expect';
import skott, {SkottInstance} from 'skott';

declare module 'expect' {
	interface Matchers<R> {
		toHaveNoCircularDeps(): R
	}
}

const toHaveNoCircularDeps: MatcherFunction = function(received: SkottInstance) {
	if (!('useGraph' in received)) throw new Error('Not a Skott instance');
	const deps = received.useGraph().findCircularDependencies();
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
		const result = await skott({cwd: 'src', dependencyTracking: {thirdParty: false, builtin: false, typeOnly: false}});
		expect(result).toHaveNoCircularDeps();
	});
});
