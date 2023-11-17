/**
 * Represents raw content as a string.
 */
export class RawContent {
	/** Indicates that the content is raw. */
	private readonly __RAW: true = true;

	/**
	 * Creates a new instance of `RawContent`.
	 * @param content The raw content as a string.
	 */
	constructor(public content: string) {}

	/**
	 * Returns the raw content with indentation minimized.
	 * @returns The content string.
	 */
	public toString(): string {
		const content = this.content.split('\n');
		const tabs = Math.min(...content.filter((line) => line.trim().length).map((line) => line.match(/^\s+/)?.[0].length || 0));
		const regex = new RegExp(`^\\s{0,${tabs}}`);
		return content.map((line) => line.replace(regex, '')).join('\n');
	}

	/**
	 * Creates a clone of the current `RawContent` instance.
	 * @returns A new instance of `RawContent` with the same content.
	 */
	public clone(): RawContent {
		return new RawContent(this.content);
	}
}
