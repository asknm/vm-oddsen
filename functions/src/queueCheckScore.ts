import { getQueue } from "./constants";

export async function queueCheckScoreHandler(mid: string) {
	await getQueue().enqueue(
		{
			mid: mid,
		},
		{
			scheduleTime: new Date(),
		}
	);
}
