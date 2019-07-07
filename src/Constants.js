const isDev = window.require("electron-is-dev");

function getProfile() {
    if(isDev)
        return `https://cors-anywhere.herokuapp.com/https://cloud.feedly.com/v3/profile`
    else
        return `https://cloud.feedly.com/v3/profile`
}

function getStream(userId, isUnreadOnly) {
    if(isDev)
        return `https://cors-anywhere.herokuapp.com/https://cloud.feedly.com/v3/streams/contents?streamId=user/${userId}/category/global.all&unreadOnly=${isUnreadOnly}`
    else
        return `https://cloud.feedly.com/v3/streams/contents?streamId=user/${userId}/category/global.all&unreadOnly=${isUnreadOnly}`
}

function getEntry(entryId) {
    let url = encodeURIComponent(entryId)
    
    if(isDev)
        return `https://cors-anywhere.herokuapp.com/https://cloud.feedly.com/v3/entries/entriesId=${url}`
    else
        return `https://cloud.feedly.com/v3/entries/entriesId=${url}`
}

export {getProfile, getStream, getEntry}