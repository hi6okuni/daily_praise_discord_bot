import { sendToDiscord } from "./discord.ts";
import { isWithin24Hours, isZeroSubmission } from "./util.ts";
import { load } from "https://deno.land/std@0.224.0/dotenv/mod.ts";

let leetCodeUsernames: string[] = [];
if (Deno.env.get("LEETCODE_USERNAMES")) {
	leetCodeUsernames = Deno.env.get("LEETCODE_USERNAMES")?.split(",") || [];
} else {
	const env = await load();
	leetCodeUsernames = env["LEETCODE_USERNAMES"]?.split(",") || [];
}

// API Documentation:
// https://github.com/alfaarghya/alfa-leetcode-api

type SubmissionEndPointResponse = {
	count: number;
	submission: {
		title: string;
		titleSlug: string;
		timestamp: string;
		statusDisplay: string;
		lang: string;
	}[];
};

type checkLeetCodeSubmissionsResponse = {
	[key: string]: {
		title: string;
		url: string;
		lang: string;
	}[];
};

async function checkLeetCodeSubmissions(): Promise<checkLeetCodeSubmissionsResponse | null> {
	try {
		const result: checkLeetCodeSubmissionsResponse = {};

		for (const username of leetCodeUsernames) {
			const response = await fetch(
				`https://alfa-leetcode-api.onrender.com/${username}/submission`,
			);
			const data: SubmissionEndPointResponse = await response.json();
			if (data.count === 0) {
				continue;
			}
			result[username] = data.submission
				.filter((submission) => {
					return isWithin24Hours(submission.timestamp);
				})
				// 重複を排除
				.reduce(
					(acc, submission) => {
						if (!acc.find((item) => item.title === submission.title)) {
							acc.push({
								title: submission.title,
								url: `https://leetcode.com/problems/${submission.titleSlug}`,
								lang: submission.lang,
							});
						}
						return acc;
					},
					[] as { title: string; url: string; lang: string }[],
				);
		}

		return result;
	} catch (error) {
		console.error("Failed to fetch data from leetcode", error);
		return null;
	}
}

export async function leetcode() {
	const leetcodeTargets = (await checkLeetCodeSubmissions()) || {};

	if (isZeroSubmission(leetcodeTargets)) {
		console.log("Leetcode no submissions found");
		return;
	}

	const title = "🚀 **Leetcode** 🚀\n\n";
	let leetcodeMessage: string;

	const contents = Object.entries(leetcodeTargets)
		.map(([username, submissions]) => {
			const userHeader = `**${username}** は ${submissions.length}問解いた！ \n`;
			const userSubmissions = submissions
				.map((submission) => {
					return `• [${submission.title}](${submission.url}) in ${submission.lang}`;
				})
				.join("\n");

			return userHeader + userSubmissions;
		})
		.join("\n\n");

	leetcodeMessage = title + contents;

	await sendToDiscord(leetcodeMessage);
}
