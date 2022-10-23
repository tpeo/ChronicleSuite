import { FieldValue } from "firebase-admin/firestore";
import functions from "firebase-functions";
import fetch from "node-fetch";
import common from "./common.js";
import initAdmin from "./init.js";

const { getAccessToken, applyMiddleware, safeFetch } = common;
const { admin } = initAdmin;

exports.getAccessToken = getAccessToken("instagram");
