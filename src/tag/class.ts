export class TagClass {
	private readonly value: Set<string> = new Set();

	constructor(value?: string | Set<string> | string[]) {
		if (!value) return;
		typeof value === 'string' ? this.add(value) : this.add(...value);
	}

	public add(...value: string[]): void {
		for (const item of value) this.value.add(item);
	}

	public remove(...value: string[]): void {
		for (const item of value) this.value.delete(item);
	}

	public clear(): void {
		this.value.clear();
	}

	public toString(): string {
		return Array.from(this.value).join(' ');
	}
}
