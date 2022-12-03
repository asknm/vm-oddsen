import { getCheckScoreQueue } from "./constants";

export async function queueCheckScoreHandler(mid: string) {
	await getCheckScoreQueue().enqueue(
		{
			mid: mid,
		},
		{
			scheduleTime: new Date(),
		}
	);
}
