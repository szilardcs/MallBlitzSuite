import type { APIResponse } from "@playwright/test";

type BaseErrorOptions = {
	requestUrl: string;
	method: string;
	response?: APIResponse;
};

export class HttpStatusError extends Error {
	constructor(
		private readonly opts: BaseErrorOptions & {
			status: number;
			expected: number[];
			bodySnippet?: string;
		}
	) {
		super(
			`Unexpected status ${opts.status} received for ${opts.method} ${opts.requestUrl}. Expected: ${opts.expected.join(
				", "
			)}.`
		);
	}

	get status(): number {
		return this.opts.status;
	}

	get expected(): number[] {
		return this.opts.expected;
	}

	get bodySnippet(): string | undefined {
		return this.opts.bodySnippet;
	}
}

export class ContentTypeError extends Error {
	constructor(
		private readonly opts: BaseErrorOptions & {
			contentType: string | undefined;
			expected: string;
		}
	) {
		super(
			`Expected content-type ${opts.expected} but received "${
				opts.contentType ?? "unknown"
			}" for ${opts.method} ${opts.requestUrl}.`
		);
	}
}

export class SchemaValidationError extends Error {
	constructor(
		private readonly opts: BaseErrorOptions & {
			issues: string;
			rawBody: unknown;
		}
	) {
		super(`Schema validation failed for ${opts.method} ${opts.requestUrl}: ${opts.issues}`);
	}
}
