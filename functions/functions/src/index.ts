import * as admin from "firebase-admin";

admin.initializeApp({
	credential: admin.credential.applicationDefault(),
});

const newUser = require("./newUser");
exports.newUser = newUser.newUser;
