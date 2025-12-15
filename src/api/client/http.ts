import type { APIRequestContext } from "@playwright/test";
import type { ZodSchema } from "zod";
import { env } from "../../config/env";
import { ContentTypeError, HttpStatusError, SchemaValidationError } from "./errors";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type RequestOptions<T> = {
	headers?: Record<string, string>;
	query?: Record<string, string | number | boolean | undefined>;
	body?: unknown;
	expectedStatus?: number | number[];
	schema?: ZodSchema<T>;
};

export type ParsedResponse<T> = {
	status: number;
	headers: Record<string, string>;
	data: T;
	rawBody: unknown;
};

const JSON_CONTENT_TYPE = "application/json";

const buildUrl = (path: string, query?: RequestOptions<unknown>["query"]): string => {
	const url = new URL(path, env.MAIL_API_BASE_URL);

	if (query) {
		for (const [key, value] of Object.entries(query)) {
			if (value === undefined) {
				continue;
			}

			url.searchParams.set(key, String(value));
		}
	}

	return url.toString();
};

const normalizeStatuses = (status?: number | number[]): number[] =>
	status === undefined ? [200] : Array.isArray(status) ? status : [status];

const serializeBody = (body: unknown): string | undefined => {
	if (body === undefined || body === null) {
		return undefined;
	}

	return typeof body === "string" ? body : JSON.stringify(body);
};

export const requestJson = async <T>(
	ctx: APIRequestContext,
	method: HttpMethod,
	path: string,
	opts: RequestOptions<T> = {}
): Promise<ParsedResponse<T>> => {
	const url = buildUrl(path, opts.query);
	const response = await ctx.fetch(url, {
		method,
		headers: {
			accept: JSON_CONTENT_TYPE,
			...(opts.body ? { "content-type": JSON_CONTENT_TYPE } : {}),
			...opts.headers,
		},
		data: serializeBody(opts.body),
		timeout: env.MAIL_API_REQUEST_TIMEOUT_MS,
	});

	const status = response.status();
	const allowedStatuses = normalizeStatuses(opts.expectedStatus);

	if (!allowedStatuses.includes(status)) {
		const snippet = await response
			.text()
			.then((text) => text.slice(0, 1000))
			.catch(() => undefined);

		throw new HttpStatusError({
			method,
			requestUrl: url,
			status,
			expected: allowedStatuses,
			bodySnippet: snippet,
			response,
		});
	}

	const headers = response.headers();
	const contentType = headers["content-type"];

	if (env.MAIL_API_STRICT_HEADERS && !(contentType ?? "").includes(JSON_CONTENT_TYPE)) {
		throw new ContentTypeError({
			method,
			requestUrl: url,
			contentType,
			expected: JSON_CONTENT_TYPE,
			response,
		});
	}

	const rawBody = await response.json();

	if (opts.schema) {
		const parsed = opts.schema.safeParse(rawBody);
		if (!parsed.success) {
			throw new SchemaValidationError({
				method,
				requestUrl: url,
				issues: parsed.error.toString(),
				rawBody,
				response,
			});
		}

		return { status, headers, data: parsed.data, rawBody };
	}

	return { status, headers, data: rawBody as T, rawBody };
};
