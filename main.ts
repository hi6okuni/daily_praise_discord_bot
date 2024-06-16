import { sendToDiscord } from "./discord.ts";
import { checkLeetCodeSubmissions } from "./leetcode.ts";

// async function main() {
	const leedcodeTargets = (await checkLeetCodeSubmissions()) || [];
	console.log(leedcodeTargets);

	// const discordMessage = leedcodeTargets
	// 	.map((target) => {
	// 		const username = Object.keys(target)[0];
	// 		const submissions = target[username];
	// 		return submissions
	// 			.map((submission) => {
	// 				return `${username} solved ${submission.title} in ${submission.lang}`;
	// 			})
	// 			.join("\n");
	// 	})
	// 	.join("\n");

  const discordMessage = 'test message'

	await sendToDiscord(discordMessage);
// }
