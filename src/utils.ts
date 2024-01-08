import type {TagChild} from './types.js';

/**
 * Encodes special characters in a string to their corresponding HTML entities.
 * @param input The string to encode.
 * @returns The encoded string.
 */
export function encodeEntities(input: string): string {
	return input.
		replace(/&/g, '&amp;').
		replace(/"/g, '&quot;').
		replace(/©/g, '&copy;').
		replace(/®/g, '&reg;').
		replace(/™/g, '&trade;').
		replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, (value: string) => {
			return '&#' + (((value.charCodeAt(0) - 0xD800) * 0x400) + (value.charCodeAt(1) - 0xDC00) + 0x10000) + ';';
		}).
		replace(/([^\#-~ |!])/g, (value: string) => {
			return '&#' + value.charCodeAt(0) + ';';
		}).
		replace(/</g, '&lt;').
		replace(/>/g, '&gt;');
}

/**
 * Loops over the given number of iterations and calls the given callback function for each iteration.
 * @param count The number of iterations.
 * @param callback The callback function.
 * @returns An array of the return values of the callback function.
 */
export function loop<T extends TagChild<any>>(count: number, callback: (index: number) => T): T[] {
	return Array.from({length: count}, ($$, i) => callback(i));
}
