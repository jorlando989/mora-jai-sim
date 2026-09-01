// Configuration file for environment-specific settings
// Automatically detects if running locally or deployed

const hostname = window.location.hostname;
const isLocalHost = hostname === "localhost" || hostname === "127.0.0.1";

export const API_ENDPOINT = isLocalHost
	? "http://127.0.0.1:8000"
	: "https://morajaidle-b93592b4c247.herokuapp.com";

console.log("Hostname detected:", hostname);
console.log("Is LocalHost:", isLocalHost);
console.log("Environment:", isLocalHost ? "Local" : "Production");
console.log("API Endpoint:", API_ENDPOINT);

// Alert on production to verify detection is working
if (!isLocalHost) {
	console.log("Using production API endpoint");
}
