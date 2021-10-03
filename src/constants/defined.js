// those globals should be inserted by esbuild
/* global CLIENT_ID REDIRECT_URI */
export const clientId = CLIENT_ID || ''
export const redirectUri = REDIRECT_URI || 'http://localhost:8000/auth-flow-response.html'
