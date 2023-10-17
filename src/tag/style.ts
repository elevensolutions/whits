export class TagStyle {
	private readonly value: Map<string, string> = new Map();

	constructor(value?: string | Record<string, string> | Map<string, string>) {
		if (!value) return;
		if (typeof value === 'string') {
			for (const rule of value.split(';')) for (let [name, style] of rule.split(':')) {
				this.set(name, style);
			}
		} else {
			for (const [key, style] of (value instanceof Map ? value : Object.entries(value))) {
				this.set(key, style);
			}
		}
	}

	public set(name?: string, value?: string): void {
		const trimmedName = name?.trim();
		const trimmedValue = value?.trim();
		if (!trimmedName || !trimmedValue) return;
		this.value.set(trimmedName, trimmedValue);
	}

	public toString(): string {
		return Array.from(this.value).map(([key, style]) => `${key}: ${style};`).join(' ');
	}
}
