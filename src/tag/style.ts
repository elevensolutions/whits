/**
 * Represents the `style` attribute for an HTML tag.
 */
export class TagStyle {
	/** The value of the style. */
	private readonly value: Map<string, string> = new Map();

	/**
	 * Creates a new `TagStyle` instance.
	 * @param value The initial value of the style.
	 */
	constructor(value?: string | Record<string, string> | Map<string, string>) {
		if (!value) return;
		if (typeof value === 'string') {
			for (const rule of value.split(';')) {
				const [name, style] = rule.split(':');
				this.set(name, style);
			}
		} else {
			for (const [key, style] of (value instanceof Map ? value : Object.entries(value))) {
				this.set(key, style);
			}
		}
	}

	/**
	 * Sets a style property.
	 * @param name The name of the property.
	 * @param value The value of the property.
	 */
	public set(name?: string, value?: string): void {
		const trimmedName = name?.trim();
		const trimmedValue = value?.trim();
		if (!trimmedName || !trimmedValue) return;
		this.value.set(trimmedName, trimmedValue);
	}

	/**
	 * Gets a style property.
	 * @param name The name of the property.
	 * @returns The value of the property.
	 */
	public get(name: string): string | undefined {
		return this.value.get(name);
	}

	/**
	 * Checks whether the style contains a property.
	 * @param name The name of the property.
	 * @returns `true` if the style contains the property, otherwise `false`.
	 */
	public has(name: string): boolean {
		return this.value.has(name);
	}

	/**
	 * Removes a style property.
	 * @param name The name of the property.
	 */
	public remove(name: string): boolean {
		return this.value.delete(name);
	}

	/**
	 * Removes all style properties.
	 */
	public clear(): void {
		this.value.clear();
	}

	/**
	 * Returns a string representation of the style.
	 * @returns A string representation of the style.
	 */
	public toString(): string {
		return Array.from(this.value).map(([key, style]) => `${key}: ${style};`).join(' ');
	}

	/**
	 * Returns the number of style properties.
	 * @returns The number of style properties.
	 */
	public get size(): number {
		return this.value.size;
	}
}
