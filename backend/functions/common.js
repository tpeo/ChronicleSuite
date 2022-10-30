import cors from "cors";
import functions from "firebase-functions";
import fetch from "node-fetch";

const safeFetch = async (url, method, body) => {
	const fetchOptions = method
		? {
				method,
				body,
				// headers: {
				// 	"Content-Type": "multipart/form-data",
				// },
		  }
		: {};
	functions.logger.log(fetchOptions);

	const response = await fetch(url.toString(), fetchOptions);
	functions.logger.log(response);
	if (!response) return { error: "No response" };
	const data = await response.json();
	functions.logger.log(data);
	if (!response.ok) return { error: `Error with Status ${response.status}`, data };
	return data;
};

const applyMiddleware = (req, res) =>
	cors({ origin: true })(req, res, () => {
		res.set("Access-Control-Allow-Origin", "https://localhost:3000");
	});

export default { safeFetch, applyMiddleware };
