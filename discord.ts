const WEBHOOK_URL = Deno.env.get("WEBHOOK_URL");

export async function sendToDiscord(message: string) {
	if (!WEBHOOK_URL) {
		console.error("WEBHOOK_URL is not set");
		return;
	}

	const response = await fetch(WEBHOOK_URL, {
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
