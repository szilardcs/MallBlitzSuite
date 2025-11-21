export interface EmailAddress {
	Name: string;
	Address: string;
}

export interface EmailMessage {
	ID: string;
	MessageID: string;
	Read: boolean;
	From: EmailAddress;
	To: EmailAddress[];
	Cc: EmailAddress[] | null;
	Bcc: EmailAddress[] | null;
	ReplyTo: EmailAddress[];
	Subject: string;
	Created: string; // ISO date string
	Username: string;
	Tags: string[];
	Size: number;
	Attachments: number;
	Snippet: string;
}

export interface MessagesResponse {
	total: number;
	unread: number;
	count: number;
	messages_count: number;
	messages_unread: number;
	start: number;
	tags: string[];
	messages: EmailMessage[];
}

export interface LinkCheckResponse {
	Links: Array<{
		URL: string;
		[key: string]: any; // For any additional properties
	}>;
	[key: string]: any; // For any additional properties
}
