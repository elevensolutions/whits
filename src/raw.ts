export class RawContent {
	private readonly __RAW: true = true;

	constructor(public content: string) {}

	public clone(): RawContent {
		return new RawContent(this.content);
	}
}
