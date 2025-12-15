import { config as loadEnv } from "dotenv";
import { z } from "zod";

loadEnv();

const EnvSchema = z.object({
	MAIL_API_BASE_URL: z
		.string()
		.url(),
	MAIL_API_REQUEST_TIMEOUT_MS: z.coerce.number().int().positive().default(15000),
	MAIL_API_STRICT_HEADERS: z.coerce.boolean().default(true),
	MAIL_API_MAX_ATTEMPTS: z.coerce.number().int().positive().default(10),
	MAIL_API_POLL_INTERVAL_MS: z.coerce.number().int().positive().default(1500),
});

export type Env = z.infer<typeof EnvSchema>;

const normalizeBaseUrl = (value: string): string => (value.endsWith("/") ? value : `${value}/`);

const parsed = EnvSchema.parse({
	MAIL_API_BASE_URL: process.env.MAIL_API_BASE_URL,
	MAIL_API_REQUEST_TIMEOUT_MS: process.env.MAIL_API_REQUEST_TIMEOUT_MS,
	MAIL_API_STRICT_HEADERS: process.env.MAIL_API_STRICT_HEADERS,
	MAIL_API_MAX_ATTEMPTS: process.env.MAIL_API_MAX_ATTEMPTS,
	MAIL_API_POLL_INTERVAL_MS: process.env.MAIL_API_POLL_INTERVAL_MS,
});

export const env: Env = {
	...parsed,
	MAIL_API_BASE_URL: normalizeBaseUrl(parsed.MAIL_API_BASE_URL),
};
