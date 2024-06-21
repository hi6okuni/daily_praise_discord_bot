export const isWithin24Hours = (timestamp: string) => {
	// UNIXタイムスタンプを数値に変換
	const unixTime = parseInt(timestamp, 10);
	// Dateオブジェクトを作成（ミリ秒単位にするために1000を掛ける）
	const date = new Date(unixTime * 1000);

	const now = new Date();
	const timeDifference = Math.abs(now.getTime() - date.getTime());

	// 24時間（ミリ秒単位で計算）以内であればtrueを返す
	const twentyFourHoursInMilliseconds = 24 * 60 * 60 * 1000;
	return timeDifference <= twentyFourHoursInMilliseconds;
};

type ObjectWithStringKeys<T> = { [key: string]: T[] };

export const isZeroSubmission = <T>(
	targets: ObjectWithStringKeys<T>,
): boolean => {
	return Object.keys(targets).every((key) => targets[key].length === 0);
};
