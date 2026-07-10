import { ApiError } from "../exception/api_error";
import { ResponseBuilder } from "../builders/response_builder";
import { json } from "../utils/json";

export function execute<T>(callback: () => T) {
	try {
		return json(callback());
	} catch (error) {
		if (error instanceof ApiError) {
			return json(ResponseBuilder.error(error.status, error.message, error.code, error.details));
		}

		return json(ResponseBuilder.error(500, "Internal Server Error", "INTERNAL_ERROR"));
	}
}
