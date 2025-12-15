import {test, expect} from "../../fixtures/pomManager";
import {expectMessagesResponseMeta} from "../../api/assertions/expectMail";

test.describe("Mail API", () => {
    test("lists messages with valid structure", async ({mailApi}) => {
        const response = await mailApi.listMessages();
        expectMessagesResponseMeta(response);
    });

    
    // Negative test
    test("returns undefined when email has no messages", async ({mailApi}) => {
        const message = await mailApi.findLatestMessageForRecipient(`missing_${Date.now()}@example.com`);
        expect(message).toBeUndefined();
    });
});