import { load } from "https://deno.land/std@0.224.0/dotenv/mod.ts";

let webhookURL: string | undefined;

if (Deno.env.get("WEBHOOK_URL")) {
	webhookURL = Deno.env.get("WEBHOOK_URL");
} else {
	const env = await load();
	webhookURL = env["WEBHOOK_URL"];
}

export async function sendToDiscord(message: string) {
	if (!webhookURL) {
		console.error("WEBHOOK_URL is not set");
		return;
	}

	const response = await fetch(webhookURL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			content: message,
		}),
	});

	if (!response.ok) {
		console.error("Failed to send message to Discord:", await response.text());
	}
}
