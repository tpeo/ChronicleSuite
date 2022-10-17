// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require("firebase-functions");
const { admin } = require("./init.js");

const google = require("./google.js");
const meta = require("./meta.js");

exports.meta = meta;
exports.google = google;
