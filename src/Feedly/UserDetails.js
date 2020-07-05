const Store = window.require('electron-store');
const store = new Store();

function getUserId() {
    return store.get('userId')
}

function getAuthCode() {
    return store.get('authCode')
}

function getFeedlyIntegration() {
    return store.get('integrateWithFeedly')
}

export { getUserId, getAuthCode, getFeedlyIntegration }