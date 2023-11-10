/**
 * Represents the `class` attribute for an HTML tag.
 */
export class TagClass {
	/** The value of the class. */
	private readonly value: Set<string> = new Set();

	/**
	 * Creates a new `TagClass` instance.
	 * @param value The initial value of the `class` attribute.
	 */
	constructor(value?: string | Set<string> | string[]) {
		if (!value) return;
		typeof value === 'string' ? this.add(value) : this.add(...value);
	}

	/**
	 * Adds one or more class names to the `class` attribute.
	 * @param value One or more class names to add.
	 */
	public add(...value: string[]): void {
		for (const item of value) this.value.add(item);
	}

	/**
	 * Removes one or more class names from the `class` attribute.
	 * @param value One or more class names to remove.
	 */
	public remove(...value: string[]): void {
		for (const item of value) this.value.delete(item);
	}

	/**
	 * Removes all class names from the `class` attribute.
	 */
	public clear(): void {
		this.value.clear();
	}

	/**
	 * Returns a string representation of the `class` attribute.
	 * @returns A string representation of the `class` attribute.
	 */
	public toString(): string {
		return Array.from(this.value).join(' ');
	}
}
