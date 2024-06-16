export const isTodayInJapan = (timestamp: string) => {
	// UNIXタイムスタンプを数値に変換
	const unixTime = parseInt(timestamp, 10);
	// Dateオブジェクトを作成（ミリ秒単位にするために1000を掛ける）
	const date = new Date(unixTime * 1000);

	const now = new Date();
	const options: Intl.DateTimeFormatOptions = {
		timeZone: "Asia/Tokyo",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	};

	const todayString = now.toLocaleDateString("ja-JP", options);
	const dateString = date.toLocaleDateString("ja-JP", options);

	return todayString === dateString;
};
