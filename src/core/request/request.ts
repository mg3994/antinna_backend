export class Request {
	constructor(private readonly event: GoogleAppsScript.Events.DoGet) {}

	get page() {
		return Number(this.event.parameter.page ?? 1);
	}

	get limit() {
		return Number(this.event.parameter.limit ?? 20);
	}

	get token() {
		return this.event.parameter.token;
	}

	param(name: string) {
		return this.event.parameter[name];
	}
}
