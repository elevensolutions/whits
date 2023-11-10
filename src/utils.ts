/**
 * Encodes special characters in a string to their corresponding HTML entities.
 * @param input The string to encode.
 * @returns The encoded string.
 */
export function encodeEntities(input: string): string {
	return input.
		replace(/&/g, '&amp;').
		replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, function(value: string) {
			return '&#' + (((value.charCodeAt(0) - 0xD800) * 0x400) + (value.charCodeAt(1) - 0xDC00) + 0x10000) + ';';
		}).
		replace(/([^\#-~ |!])/g, function(value: string) {
			return '&#' + value.charCodeAt(0) + ';';
		}).
		replace(/</g, '&lt;').
		replace(/>/g, '&gt;');
}
