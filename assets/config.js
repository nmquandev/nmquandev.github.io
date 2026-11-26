// Where the site calls the API. Local runs use the Functions host from `func start`.
// PROD_UNLOCK is written by the API deploy script (private repo); the chat and
// contact endpoints live next to it.
var PROD_UNLOCK = 'https://portfolio-unlock-n7rgiudkditis.azurewebsites.net/api/unlock';
var API = /^(localhost|127\.0\.0\.1)$/.test(location.hostname) ? 'http://localhost:7071/api/' : PROD_UNLOCK.replace(/unlock$/, '');
window.PORTFOLIO = {
  autoLockMinutes: 15,   // client names hide again after this many minutes without activity
  unlockEndpoint: API + 'unlock',
  chatEndpoint: API + 'chat',
  contactEndpoint: API + 'contact'
};
