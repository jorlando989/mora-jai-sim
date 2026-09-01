// Configuration file for environment-specific settings
// Automatically detects if running locally or deployed

const isLocalHost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

export const API_ENDPOINT = isLocalHost
	? "http://127.0.0.1:8000"
	: "https://morajaidle-b93592b4c247.herokuapp.com";

console.log("Host:", window.location.hostname);
console.log("Environment:", isLocalHost ? "Local" : "Production");
console.log("API Endpoint:", API_ENDPOINT);
