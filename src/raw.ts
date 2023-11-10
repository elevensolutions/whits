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
	 * Returns the raw content.
	 * @returns The raw content.
	 */
	public toString(): string {
		return this.content;
	}

	/**
	 * Creates a clone of the current `RawContent` instance.
	 * @returns A new instance of `RawContent` with the same content.
	 */
	public clone(): RawContent {
		return new RawContent(this.content);
	}
}
