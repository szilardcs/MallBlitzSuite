import { expect } from "@playwright/test";
import type { ParsedResponse } from "../client/http";
import type { LinkCheckEntry, MessagesResponse } from "../contracts/mail.contracts";

export const expectMessagesResponseMeta = (response: ParsedResponse<MessagesResponse>): void => {
	expect(response.status, "messages endpoint should return 200").toBe(200);
	expect(response.headers["content-type"]).toContain("application/json");
	expect(response.data.messages.length).toBeGreaterThanOrEqual(0);
};
