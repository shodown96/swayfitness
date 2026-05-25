export const APP_NAME = "SwayFitness"
export const APP_SEARCH_RATE = 300

// Internal request identification
// Set on every axios request so the middleware can confirm the call came from
// this app's own frontend. Not a secret — visible in the browser network tab —
// but it stops casual external callers and automated scripts.
export const APP_CLIENT_HEADER = "x-app-client"
export const APP_CLIENT_VALUE  = "swayfitness-app"