import cors from "cors";
import functions from "firebase-functions";
import fetch from "node-fetch";

const safeFetch = async (url, options) => {
	const response = await fetch(url.toString(), options);
	if (!response) return { error: "No response" };
	const data = await response.json();
	if (!response.ok) return { error: `Error with Status ${response.status}`, data };
	return data;
};

const applyMiddleware = (req, res) =>
	cors({ origin: true })(req, res, () => {
		res.set("Access-Control-Allow-Origin", "https://localhost:3000");
	});

export default { safeFetch, applyMiddleware };
