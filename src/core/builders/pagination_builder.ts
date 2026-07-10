import { ApiResponse } from "../models/api_response";

export class PaginationBuilder {
	static of<T>(data: T[], page: number, limit: number, total: number): ApiResponse<T[]> {
		return {
			success: true,
			status: 200,
			message: "Success",

			data,

			meta: {
				pagination: {
					page,
					limit,
					total,
					totalPages: Math.ceil(total / limit),
					hasNext: page * limit < total,
					hasPrevious: page > 1,
				},
			},
		};
	}
}
