import { newUserHandler } from "./newUser";
import { newMatchHandler } from "./newMatch";
import { checkScoreHandler } from "./checkScore";
import { getMatchesHandler } from "./getMatches";

import { firestore, credential } from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import { region, FunctionBuilder } from "firebase-functions";
import { defineSecret } from "firebase-functions/params";
import { myRegion } from "./constants";

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

exports.checkScore = functionBuilder
	.runWith({ secrets: [footballDataKey] })
	.tasks.taskQueue({
		retryConfig: {
			maxAttempts: 2000,
			maxRetrySeconds: 200 * 60,
			maxDoublings: 0,
		},
		rateLimits: {
			maxConcurrentDispatches: 4,
			maxDispatchesPerSecond: 1 / 6,
		},
	}).onDispatch(async (data) => await checkScoreHandler(data.mid, db, footballDataKey.value()));

exports.getMatches = functionBuilder
	.runWith({
		secrets: [footballDataKey],
		minInstances: 1,
		memory: "128MB",
	})
	.https
	.onCall(async _ => await getMatchesHandler(db, footballDataKey.value()));
