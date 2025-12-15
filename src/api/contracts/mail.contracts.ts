import { z } from "zod";
import { Identifier, IsoDateTime, NonEmptyString, PositiveInt } from "./common.contracts";

export const EmailAddressSchema = z
	.object({
		Name: z.string().optional(),
		Address: z.string().email(),
	})
	.strict();

export const EmailMessageSchema = z
	.object({
		ID: Identifier,
		MessageID: NonEmptyString,
		Read: z.boolean(),
		From: EmailAddressSchema,
		To: z.array(EmailAddressSchema).min(1),
		Cc: z.array(EmailAddressSchema).nullable().default(null),
		Bcc: z.array(EmailAddressSchema).nullable().default(null),
		ReplyTo: z.array(EmailAddressSchema),
		Subject: NonEmptyString,
		Created: IsoDateTime,
		Username: z.string().optional(),
		Tags: z.array(NonEmptyString),
		Size: PositiveInt,
		Attachments: z.number().int().nonnegative(),
		Snippet: z.string(),
	})
	.strict();

export const MessagesResponseSchema = z
	.object({
		total: PositiveInt,
		unread: PositiveInt,
		count: PositiveInt,
		messages_count: PositiveInt,
		messages_unread: PositiveInt,
		start: PositiveInt,
		tags: z.array(z.string()),
		messages: z.array(EmailMessageSchema),
	})
	.strict();

export const LinkCheckEntrySchema = z
	.object({
		URL: z.string().url(),
		StatusCode: z.number().int().min(100).max(599).optional(),
	})
	.catchall(z.unknown());

export const LinkCheckResponseSchema = z
	.object({
		Links: z.array(LinkCheckEntrySchema),
	})
	.catchall(z.unknown());

export type EmailMessage = z.infer<typeof EmailMessageSchema>;
export type MessagesResponse = z.infer<typeof MessagesResponseSchema>;
export type LinkCheckEntry = z.infer<typeof LinkCheckEntrySchema>;
