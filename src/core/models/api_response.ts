import { ApiErrorBody } from "./api_error_body";
import { Meta } from "./meta";

export interface ApiResponse<T> {
	success: boolean;
	status: number;
	message: string;

	data?: T;
	error?: ApiErrorBody;
	meta?: Meta;
}