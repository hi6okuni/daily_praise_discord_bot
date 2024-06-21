import { sendToDiscord } from "./discord.ts";
import { isWithin24Hours, isZeroSubmission } from "./util.ts";
import { load } from "https://deno.land/std@0.224.0/dotenv/mod.ts";

let atCoderUsernames: string[] = [];
if (Deno.env.get("ATCODER_USERNAMES")) {
	atCoderUsernames = Deno.env.get("ATCODER_USERNAMES")?.split(",") || [];
} else {
	const env = await load();
	atCoderUsernames = env["ATCODER_USERNAMES"]?.split(",") || [];
}
// API Documentation:
// https://github.com/kenkoooo/AtCoderProblems/blob/master/doc/api.md#example-1

type SubmissionEndPointResponse = {
	id: number;
	epoch_second: number;
	problem_id: string;
	contest_id: string;
	user_id: string;
	language: string;
	point: number;
	length: number;
	result: string;
	execution_time: number;
}[];

type checkAtCoderSubmissionsResponse = {
	[key: string]: {
		id: number;
		problem_id: string;
		contest_id: string;
		language: string;
	}[];
};

function getTargetDate(): Date {
	const today = new Date();

	return new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
}

function getFromEpochSecond(): number {
	return getTargetDate().getTime() / 1000;
}

async function checkAtCoderSubmissions(): Promise<checkAtCoderSubmissionsResponse | null> {
	const fromEpochSecond = getFromEpochSecond();
	try {
		const result: checkAtCoderSubmissionsResponse = {};

		for (const username of ATCODER_USERNAMES) {
			const response = await fetch(
				`https://kenkoooo.com/atcoder/atcoder-api/v3/user/submissions?user=${username}&from_second=${fromEpochSecond}`,
			);
			const data: SubmissionEndPointResponse = await response.json();
			console.log(data);
			if (data.length === 0) {
				continue;
			}
			result[username] = data
				.filter((submission) => {
					return isWithin24Hours(submission.epoch_second.toString());
				})
				.filter((submission) => {
					return submission.result === "AC";
				})
				// 重複を排除
				.reduce(
					(acc, submission) => {
						if (
							!acc.find((item) => item.problem_id === submission.problem_id)
						) {
							acc.push({
								id: submission.id,
								problem_id: submission.problem_id,
								contest_id: submission.contest_id,
								language: submission.language,
							});
						}
						return acc;
					},
					[] as {
						id: number;
						problem_id: string;
						contest_id: string;
						language: string;
					}[],
				);
		}

		return result;
	} catch (error) {
		console.error("Failed to fetch data from atcoder", error);
		return null;
	}
}

export async function atcoder() {
	const atcoderTargets = (await checkAtCoderSubmissions()) || {};

	if (isZeroSubmission(atcoderTargets)) {
		console.log("AtCoder no submissions found");
		return;
	}

	const title = "🚀 **AtCoder** 🚀\n\n";
	let atcoderMessage: string;
	atcoderMessage =
		title +
		Object.keys(atcoderTargets)
			.map((username) => {
				return (
					`**${username}**\n` +
					atcoderTargets[username]
						.map((submission) => {
							return `- [${submission.contest_id} - ${submission.problem_id}](https://atcoder.jp/contests/${submission.contest_id}/tasks/${submission.problem_id}) [${submission.language}]`;
						})
						.join("\n")
				);
			})
			.join("\n\n");

	await sendToDiscord(atcoderMessage);
}
