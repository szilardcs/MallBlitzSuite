import type { APIRequestContext } from "@playwright/test";
import type { HttpMethod, ParsedResponse, RequestOptions } from "./http";
import { requestJson } from "./http";

export type ApiClientOptions = {
	defaultHeaders?: Record<string, string>;
};

export class ApiClient {
	constructor(private readonly ctx: APIRequestContext, private readonly options: ApiClientOptions = {}) {}

	private mergeHeaders(headers?: Record<string, string>): Record<string, string> | undefined {
		if (!headers && !this.options.defaultHeaders) {
			return undefined;
		}

		return {
			...(this.options.defaultHeaders ?? {}),
			...(headers ?? {}),
		};
	}

	request<T>(method: HttpMethod, path: string, opts: RequestOptions<T> = {}): Promise<ParsedResponse<T>> {
		return requestJson<T>(this.ctx, method, path, {
			...opts,
			headers: this.mergeHeaders(opts.headers),
		});
	}

	get<T>(path: string, opts?: RequestOptions<T>): Promise<ParsedResponse<T>> {
		return this.request("GET", path, opts);
	}

	post<T>(path: string, opts?: RequestOptions<T>): Promise<ParsedResponse<T>> {
		return this.request("POST", path, opts);
	}

	put<T>(path: string, opts?: RequestOptions<T>): Promise<ParsedResponse<T>> {
		return this.request("PUT", path, opts);
	}

	patch<T>(path: string, opts?: RequestOptions<T>): Promise<ParsedResponse<T>> {
		return this.request("PATCH", path, opts);
	}

	delete<T>(path: string, opts?: RequestOptions<T>): Promise<ParsedResponse<T>> {
		return this.request("DELETE", path, opts);
	}
}
