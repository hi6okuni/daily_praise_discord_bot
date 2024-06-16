import { isTodayInJapan } from "./util.ts";

const LEETCODE_USERNAMES = ["hiropalla1692"];

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

export async function checkLeetCodeSubmissions() {
	try {
		const submissions = LEETCODE_USERNAMES.map(async (username) => {
			const response = await fetch(
				`https://alfa-leetcode-api.onrender.com/${username}/submission`,
			);
			const data: SubmissionEndPointResponse = await response.json();
			const targetSubmissions = data.submission.filter((submission) => {
				return isTodayInJapan(submission.timestamp);
			});
			return { [username]: targetSubmissions };
		});

		return await Promise.all(submissions);
	} catch (error) {
		console.error("Failed to fetch data from leetcode", error);
		return null;
	}
}
