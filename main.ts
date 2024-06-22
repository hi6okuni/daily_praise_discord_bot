import { atcoder } from "./atcoder.ts";
import { leetcode } from "./leetcode.ts";

Deno.cron("daily praise", "0 1 * * *", async () => {
	await leetcode();
	await atcoder();
});
