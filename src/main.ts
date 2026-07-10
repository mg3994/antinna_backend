import { execute } from "./core/handler/execute";
import { ResponseBuilder } from "./core/builders/response_builder";

function doGet(e: GoogleAppsScript.Events.DoGet) {
	return execute(() => {
		return ResponseBuilder.ok({
			name: "Manish",
			role: "Developer",
		});
	});
}
