import { ApiResponse } from "../models/api_response";

export class ResponseBuilder {
	static ok<T>(data: T, message = "Success"): ApiResponse<T> {
		return {
			success: true,
			status: 200,
			message,
			data,
		};
	}

	static created<T>(data: T, message = "Created"): ApiResponse<T> {
		return {
			success: true,
			status: 201,
			message,
			data,
		};
	}

	static error(status: number, message: string, code: string, details?: unknown): ApiResponse<never> {
		return {
			success: false,
			status,
			message,
			error: {
				code,
				details,
			},
		};
	}
}
