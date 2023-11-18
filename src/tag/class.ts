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
		if (value) this.add(...(typeof value === 'string' ? value.split(' ') : value));
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
	 * Checks whether the `class` attribute contains a class name.
	 * @param value The class name to check.
	 * @returns `true` if the `class` attribute contains the class name, otherwise `false`.
	 */
	public has(value: string): boolean {
		return this.value.has(value);
	}

	/**
	 * Returns a string representation of the `class` attribute.
	 * @returns A string representation of the `class` attribute.
	 */
	public toString(): string {
		return Array.from(this.value).join(' ');
	}

	/**
	 * Returns a CSS selector string for the `class` attribute.
	 * @returns A CSS selector string for the `class` attribute.
	 */
	public toSelector(): string {
		if (!this.value.size) return '';
		return `.${[...this.value].join('.')}`;
	}

	/**
	 * Returns the number of class names in the `class` attribute.
	 * @returns The number of class names in the `class` attribute.
	 */
	public get size(): number {
		return this.value.size;
	}
}
