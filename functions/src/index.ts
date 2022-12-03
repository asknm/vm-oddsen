import { newUserHandler } from "./newUser";
import { newMatchHandler } from "./newMatch";
import { checkScoreHandler } from "./checkScore";
import { getMatchesHandler } from "./getMatches";

import { firestore, credential } from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import { region, FunctionBuilder } from "firebase-functions";
import { defineSecret } from "firebase-functions/params";
import { myRegion } from "./constants";
import { queueCheckScoreHandler } from "./queueCheckScore";
import { TaskQueueOptions } from "firebase-functions/v1/tasks";

initializeApp({
	credential: credential.applicationDefault(),
});

const db = firestore();
const functionBuilder: FunctionBuilder = region(myRegion);

const footballDataKey = defineSecret('football_data_key');

exports.newUser =
	functionBuilder
		.auth.user().onCreate(async (user) => await newUserHandler(user, db));

exports.newMatch =
	functionBuilder
		.firestore
		.document('matches/{mid}')
		.onCreate(async (snap, _) => await newMatchHandler(snap));

exports.queueCheckScore =
	functionBuilder
		.https
		.onRequest(async (req, res) => {
			await queueCheckScoreHandler(req.body.mid);
			res.status(200).end();
		});

exports.checkScore = functionBuilder
	.runWith({
		secrets: [footballDataKey],
		memory: "128MB",
	})
	.tasks.taskQueue(getTaskQueueOptions())
	.onDispatch(async (data) => await checkScoreHandler(data.mid, db, footballDataKey.value()));

function getTaskQueueOptions(): TaskQueueOptions {
	const maxApiCallsPerMinute = 10;
	const maxMinutesBeforeFullTime = 200;
	const maxConcurrentMatches = 2;
	return {
		retryConfig: {
			maxAttempts: maxApiCallsPerMinute * maxMinutesBeforeFullTime,
			maxRetrySeconds: maxMinutesBeforeFullTime * 60,
			minBackoffSeconds: 60 / maxApiCallsPerMinute,
			maxBackoffSeconds: 60 / maxApiCallsPerMinute,
		},
		rateLimits: {
			maxConcurrentDispatches: maxConcurrentMatches,
			maxDispatchesPerSecond: maxApiCallsPerMinute / 60,
		},
	};
}

const envProjectId = JSON.parse(process.env.FIREBASE_CONFIG!).projectId;

exports.getMatchesHttp = functionBuilder
	.runWith({
		secrets: [footballDataKey],
		minInstances: envProjectId === "vm-oddsen" ? 1 : 0,
		memory: "512MB",
	})
	.https
	.onRequest(async (req, res) => await getMatchesHandler(db, footballDataKey.value(), res));
